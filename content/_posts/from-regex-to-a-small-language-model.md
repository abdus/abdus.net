---
title: "Parsing Bank SMS with Regex, Classic ML and a Fine-Tuned 0.5B Model"
date: 2026-11-01T22:00:00+05:30
draft: false
meta:
  image: /assets/posts/from-regex-to-a-small-language-model/cover.webp
  description: "Rules, then classic machine learning, then a fine-tuned 0.5B language model that runs on the phone: how Spends turns bank SMS into transactions, and what broke at every step."
featured: true
tableofcontents: true
tags: ['machine-learning', 'llm', 'fine-tuning', 'lora', 'qwen', 'flutter', 'on-device']
categories: ['ml']
---

> TL;DR: I wanted my expense tracker to read bank SMS and turn each one into a
> transaction. Regex rules got 93% fully right. Classic machine learning fell
> off a cliff on the first new bank template. A fine-tuned **0.5B language
> model**, small enough to live on the phone, gets **98.5%**. The models are
> [on Hugging Face](https://huggingface.co/azabdus/qwen2.5-0.5b-sms-txn).

![Reading bank SMS: rules, then classic ML, then a small language model](/assets/posts/from-regex-to-a-small-language-model/cover.svg)

In India, every rupee that moves sends you an SMS. Card swipe? SMS. UPI to the
chaiwala? SMS. EMI auto-debit at 3 am? SMS. So the most complete record of my
spending is sitting right there in my inbox, just in a format no app can add up.

So I built **Spends**, a small expense tracker with exactly one hard job: read a
bank SMS and, if money moved, write down how much, which way, and to whom. It
took three attempts and three very different technologies. Here's where it
ended up:

![Headline numbers](/assets/posts/from-regex-to-a-small-language-model/headline.svg)

## The Problem

In goes a message, out comes a transaction object with six fields:

![An SMS and the transaction it becomes](/assets/posts/from-regex-to-a-small-language-model/anatomy.svg)

Sounds simple, right? Except banks write these however they like, and plenty of
messages that _look_ like transactions aren't:

![Four tricky messages](/assets/posts/from-regex-to-a-small-language-model/tricky.svg)

The number that matters in this post is **whole object** accuracy: all six
fields right. An expense with the right amount and the wrong merchant is still a
wrong expense.

### The Dataset

Before anything clever, I needed a way to measure. I pulled every SMS off my
phone and labelled all of them:

![How the messages were labelled](/assets/posts/from-regex-to-a-small-language-model/labelling.svg)

One rule throughout: **split by date, never randomly.** Banks reuse templates,
so a random split leaks near-copies into the test set and flatters everything.
Train on the past, test on 2026.

## Level 1: Rules

The obvious first move: a big Dart file of regular expressions, template by
template. And honestly, it works pretty well: **97.1%** right on "transaction or
not", **93.5%** on the whole object.

The last 6.5% is where rules hurt:

![Largest error clusters of the regex parser](/assets/posts/from-regex-to-a-small-language-model/parser-errors.svg)

One reminder template ("Keep your credit score healthy! Repay Rs X by…") was read
as money coming **in**, 149 times. Every bar there is a rule nobody had written
yet. The blockers:

1. **Whack-a-mole.** Each fix is easy; there's always another one.
2. **Merchants.** Only 91% right. Free text is exactly what regexes are bad at.
3. **It can't know who you are.** "Transfer to MD ABDUS SAMAD" is spending if
   he's a friend, and moving my own money if it's me.

## Level 2: Classic Machine Learning

So, learn the patterns instead of writing them. A **logistic regression** for
"is this a transaction?", a **CRF** to tag the amount and merchant in the text,
and two small classifiers for direction and transfer. About 2 MB, microseconds
per message.

On formats it had seen it was _great_: **99.3%**. Then I tested it the honest
way, on 2026:

![Whole-object accuracy on 2026 SMS for each approach](/assets/posts/from-regex-to-a-small-language-model/approaches.svg)

**81%.** Worse than the rules. Why? One bank changed one template:

![One in five test messages used a new format](/assets/posts/from-regex-to-a-small-language-model/waffle.svg)

The model had never seen "is paid from … to" mean money going out. A fifth of
the year fell through the floor. Fresh labels fix it fast, but someone has to
label:

![Classic ML recovers quickly with a few fresh labels](/assets/posts/from-regex-to-a-small-language-model/fewshot.svg)

Ten confirmed messages and it's back above the rules. But that means a labelling
loop in the app, retraining on the phone, and a user willing to do it. Without
that, the model goes stale the next time any bank touches a template.

So I was stuck between rules that never learn and a model that only learns with
babysitting.

## Why a Language Model?

Then I read Arpit Bhayani's post,
[Compiling an SOP into a 3B Model](https://arpitbhayani.me/blogs/compiling-an-sop-into-a-3b-model/).
Take a long procedure you'd normally paste into an LLM's prompt, fine-tune a
small model until the procedure lives in its **weights**, and shrink the prompt
to a single trigger word.

I already had the procedure (my 2,100-token labelling guideline) and 15,017
examples of it applied. And a language model doesn't match patterns, it
_reads_: "INR 299 is paid from … to JioHotstar" means money out to JioHotstar in
plain English, whether or not that template ever showed up in training. The
question was whether a model small enough for a phone could do it.

## Level 3: A Small Language Model

I went with **Qwen2.5-0.5B-Instruct** (half a billion parameters, Apache 2.0),
plus its 1.5B sibling to see what size buys:

![From labelled SMS to a model on the phone](/assets/posts/from-regex-to-a-small-language-model/pipeline.svg)

1. **LoRA.** Small rank-16 adapters on every layer instead of retraining all the
   weights. A 35 MB adapter.
2. **Loss on the answer only.** The model reads the SMS but is only graded on
   the JSON it writes. (This matters for privacy, more later.)
3. **Trigger-only prompt.** The system prompt is just `sms_txn_v1`.
4. **One epoch on a free Colab T4.** 23 minutes for the 0.5B.

### Compiling the Guideline Into the Weights

![The rulebook moves from the prompt into the weights](/assets/posts/from-regex-to-a-small-language-model/prompt.svg)

The untuned model, reading the entire guideline, got **8.1%** right: it called
almost everything a transaction. Fine-tuned, with one trigger word: **97.4%**,
on the first try.

And the real test: the first run had **zero** examples of that new bank
template. Classic ML lost a fifth of the year to it. The small model read **496
of 496** correctly, every amount right, the merchant right on 492.

That's when it clicked. Rules needed someone to write a regex. Classic ML needed
someone to label. The language model just... read it.

### Five Runs Later

Each run fixed what the previous one exposed:

![Whole-object accuracy across five training runs](/assets/posts/from-regex-to-a-small-language-model/slm-runs.svg)

- **Run 2** added 60 examples from two weak banks, the way you'd label the
  first days of a new one.
- **Run 3** tried the 1.5B: 99.0%, at 2.5× the size.
- **Runs 4 and 5** fixed transfers (next section).

Training itself was boringly stable. One epoch is enough:

![Validation loss during training](/assets/posts/from-regex-to-a-small-language-model/loss-curves.svg)

### Whose Phone Is It?

The hardest field was `is_transfer`. A payment to **MD ABDUS SAMAD** (me) is
moving my own money; a payment to anyone else is spending. But the prompt never
said whose phone it was.

So the 1.5B did the only thing it could: it **memorised my name**. Any payment
to me was a transfer, on anyone's phone, and so was "MD IMRAN KHAN", because the
"MD …" pattern looked like me.

The fix: an `owner:` line in every prompt, and a **made-up owner** in every
training example, so my real name never reaches the model:

![One labelled SMS becomes several training examples](/assets/posts/from-regex-to-a-small-language-model/owner-swap.svg)

Now it has to _compare_ the payee with the owner. It worked:

![Transfers to the owner caught, before and after the owner line](/assets/posts/from-regex-to-a-small-language-model/transfers.svg)

The catch: merchant accuracy slipped a little. The made-up names came from short
lists, so the model got used to them and started "correcting" real names towards
familiar ones, an extra L here, a vowel there.

### Run 6: Fixing What the Fix Broke

So one more run, with three changes. Half the made-up owners got invented,
one-off names (no name common enough to become a favourite). The sender line was
left out of a quarter of the examples, because someone pasting an SMS into an
API won't have it. And the `folder:` line went away, since the app only reads
received messages.

By now Colab's free GPUs had run out, so this one ran on **Modal**, on a B200:
**7 minutes** to train instead of 44.

![Run 6 against run 4](/assets/posts/from-regex-to-a-small-language-model/v3.svg)

Merchants are back up, every transfer to the owner is caught with zero false
alarms, and the model barely notices when the sender is missing. The 1.5B
version doesn't notice at all.

### Looking Inside

To trust a model, I wanted to see it think. So I built a small test page: paste
an SMS, get the transaction, and see **how sure** the model was of each field.
Turn on "Tokens" and you see the message the way the model does, in pieces:

![The test page with the token view turned on](/assets/posts/from-regex-to-a-small-language-model/test-page-tokens.webp)

The interesting cases are where it hesitates. This EMI payment is called an
own-account transfer at only 56%, with "false" at 44%. A genuine coin flip, and
the page says so:

![The test page showing a low-confidence answer](/assets/posts/from-regex-to-a-small-language-model/test-page-unsure.webp)

That number is useful beyond debugging: an app can ask the user about only the
answers the model wasn't sure of.

### Making It Phone-Sized

![Download size against accuracy](/assets/posts/from-regex-to-a-small-language-model/size-vs-accuracy.svg)

Fold the adapter into the model, squeeze it to 4 bits, and it fits:

| Format | 0.5B | 1.5B | Runs on |
|---|---|---|---|
| GGUF `Q4_0` | **352 MB** | | Android, llama.cpp |
| GGUF `Q4_K_M` | 398 MB | 986 MB | phones and laptops |
| MLX 4-bit | 290 MB | 847 MB | iPhone and Mac |

4-bit loses next to nothing (26 of my 29 demo messages, against 27 at full
precision). The 0.5B is the phone model; the 1.5B is half a point better and
nearly three times the size.

## What Broke Along the Way

Nothing was as smooth as the charts look:

![Six things that broke along the way](/assets/posts/from-regex-to-a-small-language-model/blockers.svg)

## Training on My SMS, Then Publishing It

The model learned from nearly five years of _my_ messages, and I wanted to
publish it. So before uploading, I tried to break it:

![What a stranger can and can't extract](/assets/posts/from-regex-to-a-small-language-model/privacy.svg)

One Hugging Face gotcha worth knowing: **squashing a repo's history doesn't
delete old uploads.** They vanish from the commit list but still download by
commit hash. Deleting the repo and uploading again is the only real fix.

## The App

All of this would be a nice notebook if it didn't end up in an app. Spends is
a Flutter app, and on Android it does the boring part well: it asks for SMS
access, reads the inbox once on first launch (300 messages first so this month
shows up instantly, then 1,500 at a time in the background), and after that a
small receiver wakes up for every new SMS. Only business senders are read. A
10-digit number is a person, so "I sent you Rs 500" from a friend never gets in.

![Spends: the month, a payment, budgets and capture settings](/assets/posts/from-regex-to-a-small-language-model/app-gallery.webp)

Every payment keeps the original SMS it came from, right there at the bottom.
That one detail did more for trust than any accuracy number.

### All Three, Not One

Here's the funny part: the app didn't _replace_ rules with ML with a language
model. It runs all three, and each one only gets the final say when it's sure:

![How the three layers decide in the app](/assets/posts/from-regex-to-a-small-language-model/app-cascade.svg)

The guard on the language model is my favourite bit: its amount has to appear,
character for character, in the SMS. On the test set it threw out exactly two
answers, and one of them was a genuine misread (₹1,20,800 for ₹12,080). Cheap
insurance.

### On the Phone

The model isn't in the APK. Turn it on, and the app downloads the 352 MB file
from my own server (not Hugging Face, so a repo change can never break the
app), checks its SHA-256, and loads it on first use. It unloads after a minute
of doing nothing. The owner's name comes from a separate "You" row in Settings,
just the name. Leaving out the UPI ids costs 2 transfers in 1,283.

![Measured on a Pixel 7a](/assets/posts/from-regex-to-a-small-language-model/app-numbers.svg)

1.5 seconds per SMS is nothing for a message that just arrived. For a whole
inbox it's hours, so the model reads new messages only, and re-reading the past
is an opt-in background job.

And of course, the phone had its own list of walls:

![Six blockers on the app side](/assets/posts/from-regex-to-a-small-language-model/app-blockers.svg)

The Play Protect one still stings: in India, an SMS app installed from a browser
simply can't be granted the permission it needs. USB install works; a Play
Store listing (with Google's SMS declaration form) is the real fix, and it's
next on the list.

## What's Next

- **Ask, don't guess:** the app shows no confidence today. Use it to ask about
  only the shaky answers, and feed those back into training.
- **Play Store:** submit the SMS permission declaration, so installing Spends
  doesn't need a USB cable.

## Conclusion

Each approach won somewhere. Rules are cheap and predictable for formats you've
seen. Classic ML is tiny and precise, but only knows the past. The language
model needs a GPU to train, but it's the only one that read a bank format it had
never seen, which is exactly what kept breaking the other two.

The surprise wasn't that a language model could do this. It was how _small_ it
could be: half a billion parameters, a free GPU, one epoch, and a phone-sized
file that beats the regex parser I'd been tuning by hand.

The models are public if you want to poke at them:

- [azabdus/qwen2.5-0.5b-sms-txn](https://huggingface.co/azabdus/qwen2.5-0.5b-sms-txn)
  ([GGUF](https://huggingface.co/azabdus/qwen2.5-0.5b-sms-txn-GGUF),
  [MLX](https://huggingface.co/azabdus/qwen2.5-0.5b-sms-txn-mlx-4bit))
- [azabdus/qwen2.5-1.5b-sms-txn](https://huggingface.co/azabdus/qwen2.5-1.5b-sms-txn)
  ([GGUF](https://huggingface.co/azabdus/qwen2.5-1.5b-sms-txn-GGUF),
  [MLX](https://huggingface.co/azabdus/qwen2.5-1.5b-sms-txn-mlx-4bit))

Remember to send the `owner:` line. Haha, that one cost me two training runs.
