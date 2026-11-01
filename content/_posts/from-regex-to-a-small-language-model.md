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

<blockquote>TL;DR: I wanted my expense tracker to read bank SMS and turn each one into a
transaction. Regex rules got 93% fully right. Classic machine learning fell
off a cliff on the first new bank template. A fine-tuned <strong>0.5B language
model</strong>, small enough to live on the phone, gets <strong>98.5%</strong>. The models are
<a href="https://huggingface.co/azabdus/qwen2.5-0.5b-sms-txn">on Hugging Face</a>.</blockquote>

![Reading bank SMS: rules, then classic ML, then a small language model](/assets/posts/from-regex-to-a-small-language-model/cover.svg)

In India, every rupee that moves sends you an SMS. Card swipe? SMS. UPI to the
chaiwala? SMS. EMI auto-debit at 3 am? SMS. So the most complete record of my
spending is sitting right there in my inbox, just in a format no app can add up.

So I built **Spends**, a small expense tracker with exactly one hard job: read a
bank SMS and, if money moved, write down how much, which way, and to whom. It
took three attempts. If you only have a minute, this is the whole post:

![The whole post at a glance](/assets/posts/from-regex-to-a-small-language-model/at-a-glance.svg)

![Headline numbers](/assets/posts/from-regex-to-a-small-language-model/headline.svg)

## The Problem

<div style="margin:1.75em 0;padding:16px 20px;border-left:4px solid #2a78d6;border-radius:12px;background:rgb(var(--surface))"><strong>One number to watch: whole-object accuracy.</strong> All six fields right. An expense with the right amount and the wrong merchant is still a wrong expense.</div>

![An SMS and the transaction it becomes](/assets/posts/from-regex-to-a-small-language-model/anatomy.svg)

Sounds simple, right? Except plenty of messages that _look_ like transactions
aren't:

![Four tricky messages](/assets/posts/from-regex-to-a-small-language-model/tricky.svg)

<details style="margin:1.5em 0;padding:2px 20px;border:1px solid rgb(var(--line) / 0.12);border-radius:12px">
<summary style="cursor:pointer;padding:12px 0;font-weight:600;color:rgb(var(--tint))">More: how 15,017 messages got labelled</summary>

Before anything clever, I needed a way to measure. I pulled every SMS off my
phone and labelled all of them:

![How the messages were labelled](/assets/posts/from-regex-to-a-small-language-model/labelling.svg)

One rule throughout: **split by date, never randomly.** Banks reuse templates,
so a random split leaks near-copies into the test set and flatters everything.
Train on the past, test on 2026.

</details>

## Level 1: Rules

<div style="margin:1.75em 0;padding:16px 20px;border-left:4px solid #eb6834;border-radius:12px;background:rgb(var(--surface))"><strong>Rules: 93.5% fully right.</strong> Cheap and predictable, but every new template needs a new rule, and only 91% of merchants come out right.</div>

A big Dart file of regular expressions, template by template. Honestly, it works
pretty well. The last 6.5% is where it hurts:

![Largest error clusters of the regex parser](/assets/posts/from-regex-to-a-small-language-model/parser-errors.svg)

<details style="margin:1.5em 0;padding:2px 20px;border:1px solid rgb(var(--line) / 0.12);border-radius:12px">
<summary style="cursor:pointer;padding:12px 0;font-weight:600;color:rgb(var(--tint))">More: the three blockers with rules</summary>

1. **Whack-a-mole.** Each fix is easy; there's always another one. One reminder
   template ("Repay Rs X by…") was read as money coming **in**, 149 times.
2. **Merchants.** Only 91% right. Free text is exactly what regexes are bad at.
3. **It can't know who you are.** "Transfer to MD ABDUS SAMAD" is spending if
   he's a friend, and moving my own money if it's me.

</details>

## Level 2: Classic Machine Learning

<div style="margin:1.75em 0;padding:16px 20px;border-left:4px solid #1baf7a;border-radius:12px;background:rgb(var(--surface))"><strong>Classic ML: 99.3% on formats it knew, 81% on the future.</strong> One bank changed one template, and a fifth of the year fell through the floor.</div>

A **logistic regression** for "is this a transaction?", a **CRF** to tag the
amount and merchant, two small classifiers for the rest. About 2 MB,
microseconds per message. Then I tested it the honest way, on 2026:

![Whole-object accuracy on 2026 SMS for each approach](/assets/posts/from-regex-to-a-small-language-model/approaches.svg)

![One in five test messages used a new format](/assets/posts/from-regex-to-a-small-language-model/waffle.svg)

<details style="margin:1.5em 0;padding:2px 20px;border:1px solid rgb(var(--line) / 0.12);border-radius:12px">
<summary style="cursor:pointer;padding:12px 0;font-weight:600;color:rgb(var(--tint))">More: fresh labels fix it, but someone has to label</summary>

The model had never seen "is paid from … to" mean money going out. A few
confirmed examples of the new template fix it fast:

![Classic ML recovers quickly with a few fresh labels](/assets/posts/from-regex-to-a-small-language-model/fewshot.svg)

Ten confirmed messages and it's back above the rules. But that means a labelling
loop in the app, retraining on the phone, and a user willing to do it. Without
that, the model goes stale the next time any bank touches a template.

</details>

So I was stuck between rules that never learn and a model that only learns with
babysitting.

## Why a Language Model?

Then I read Arpit Bhayani's post,
[Compiling an SOP into a 3B Model](https://arpitbhayani.me/blogs/compiling-an-sop-into-a-3b-model/):
fine-tune a small model until a long procedure lives in its **weights**, and
shrink the prompt to a single trigger word. I already had the procedure (my
2,100-token labelling guideline) and 15,017 examples of it applied. And a
language model doesn't match patterns, it _reads_.

## Level 3: A Small Language Model

<div style="margin:1.75em 0;padding:16px 20px;border-left:4px solid #2a78d6;border-radius:12px;background:rgb(var(--surface))"><strong>0.5B model: 97.4% on the first try, 98.5% after tuning.</strong> And 496 of 496 on the bank format that broke classic ML, with zero examples of it in training.</div>

![The rulebook moves from the prompt into the weights](/assets/posts/from-regex-to-a-small-language-model/prompt.svg)

The untuned model, reading the entire guideline, got **8.1%**. Fine-tuned, with
one trigger word: **97.4%**. And on that new bank template, which the first run
had **zero** examples of, it read **496 of 496**, every amount right.

That's when it clicked. Rules needed someone to write a regex. Classic ML needed
someone to label. The language model just... read it.

<details style="margin:1.5em 0;padding:2px 20px;border:1px solid rgb(var(--line) / 0.12);border-radius:12px">
<summary style="cursor:pointer;padding:12px 0;font-weight:600;color:rgb(var(--tint))">More: how it was trained</summary>

**Qwen2.5-0.5B-Instruct** (half a billion parameters, Apache 2.0), plus its
1.5B sibling to see what size buys:

![From labelled SMS to a model on the phone](/assets/posts/from-regex-to-a-small-language-model/pipeline.svg)

1. **LoRA.** Small rank-16 adapters on every layer instead of retraining all the
   weights. A 35 MB adapter.
2. **Loss on the answer only.** The model reads the SMS but is only graded on
   the JSON it writes. (This matters for privacy, more later.)
3. **Trigger-only prompt.** The system prompt is just `sms_txn_v1`.
4. **One epoch.** 23 minutes on a free Colab T4, later 7 on a Modal B200.

Training itself was boringly stable:

![Validation loss during training](/assets/posts/from-regex-to-a-small-language-model/loss-curves.svg)

</details>

<details style="margin:1.5em 0;padding:2px 20px;border:1px solid rgb(var(--line) / 0.12);border-radius:12px">
<summary style="cursor:pointer;padding:12px 0;font-weight:600;color:rgb(var(--tint))">More: five training runs, and what each one fixed</summary>

![Whole-object accuracy across five training runs](/assets/posts/from-regex-to-a-small-language-model/slm-runs.svg)

- **Run 2** added 60 examples from two weak banks, the way you'd label the
  first days of a new one.
- **Run 3** tried the 1.5B: 99.0%, at 2.5× the size.
- **Runs 4 and 5** fixed transfers (next section).

</details>

### Whose Phone Is It?

<div style="margin:1.75em 0;padding:16px 20px;border-left:4px solid #2a78d6;border-radius:12px;background:rgb(var(--surface))"><strong>Transfers to the owner: 4 of 17 → 17 of 17.</strong> Once the prompt says whose phone it is, and my real name never reaches the training data.</div>

`is_transfer` depends on who you are. The prompt never said, so the 1.5B
**memorised my name**: any payment to "MD ABDUS SAMAD" was a transfer, on anyone's
phone. The fix was an `owner:` line in every prompt, and a **made-up owner** in
every training example:

![Transfers to the owner caught, before and after the owner line](/assets/posts/from-regex-to-a-small-language-model/transfers.svg)

<details style="margin:1.5em 0;padding:2px 20px;border:1px solid rgb(var(--line) / 0.12);border-radius:12px">
<summary style="cursor:pointer;padding:12px 0;font-weight:600;color:rgb(var(--tint))">More: the made-up owners, and the bug they caused</summary>

![One labelled SMS becomes several training examples](/assets/posts/from-regex-to-a-small-language-model/owner-swap.svg)

Now it has to _compare_ the payee with the owner. The catch: merchant accuracy
slipped a little. The made-up names came from short lists, so the model started
"correcting" real names towards familiar ones, an extra L here, a vowel there.

So run 6 gave half the made-up owners invented, one-off names, left the sender
out of a quarter of the examples (someone pasting an SMS into an API won't have
it), and dropped the `folder:` line. Colab's free GPUs had run out by then, so it
ran on **Modal**: 7 minutes on a B200 instead of 44.

![Run 6 against run 4](/assets/posts/from-regex-to-a-small-language-model/v3.svg)

But it isn't in the app yet. Squeezed to 4 bits for the phone, it scores 98.2%
against 98.5% for the run 4 build the app ships, and it started calling a few
stock-trade confirmations and charge notices payments. So the phone keeps run 4
until a retrain beats it, with the same 4-bit file, on the same messages.

</details>

### Looking Inside

To trust a model, I wanted to see it think. So I built a test page: paste an
SMS, get the transaction, see **how sure** the model was of each field, and the
message the way the model sees it, in pieces:

![The test page with the token view turned on](/assets/posts/from-regex-to-a-small-language-model/test-page-tokens.webp)

<details style="margin:1.5em 0;padding:2px 20px;border:1px solid rgb(var(--line) / 0.12);border-radius:12px">
<summary style="cursor:pointer;padding:12px 0;font-weight:600;color:rgb(var(--tint))">More: what a coin flip looks like</summary>

This EMI payment is called an own-account transfer at only 56%, with "false" at
44%. An app can ask the user about only answers like this one.

![The test page showing a low-confidence answer](/assets/posts/from-regex-to-a-small-language-model/test-page-unsure.webp)

</details>

### Making It Phone-Sized

![Download size against accuracy](/assets/posts/from-regex-to-a-small-language-model/size-vs-accuracy.svg)

<details style="margin:1.5em 0;padding:2px 20px;border:1px solid rgb(var(--line) / 0.12);border-radius:12px">
<summary style="cursor:pointer;padding:12px 0;font-weight:600;color:rgb(var(--tint))">More: every file size</summary>

| Format | 0.5B | 1.5B | Runs on |
|---|---|---|---|
| GGUF `Q4_0` | **352 MB** | | Android, llama.cpp |
| GGUF `Q4_K_M` | 398 MB | 986 MB | phones and laptops |
| MLX 4-bit | 290 MB | 847 MB | iPhone and Mac |

4-bit loses next to nothing (26 of my 29 demo messages, against 27 at full
precision). The 0.5B is the phone model; the 1.5B is half a point better and
nearly three times the size.

</details>

## What Broke Along the Way

![Six things that broke along the way](/assets/posts/from-regex-to-a-small-language-model/blockers.svg)

## Training on My SMS, Then Publishing It

<div style="margin:1.75em 0;padding:16px 20px;border-left:4px solid #1baf7a;border-radius:12px;background:rgb(var(--surface))"><strong>0 names extracted.</strong> I attacked both public models for the names of people I'd paid. Neither gave up a single one.</div>

![What a stranger can and can't extract](/assets/posts/from-regex-to-a-small-language-model/privacy.svg)

<details style="margin:1.5em 0;padding:2px 20px;border:1px solid rgb(var(--line) / 0.12);border-radius:12px">
<summary style="cursor:pointer;padding:12px 0;font-weight:600;color:rgb(var(--tint))">More: a Hugging Face gotcha</summary>

**Squashing a repo's history doesn't delete old uploads.** They vanish from the
commit list but still download by commit hash. Deleting the repo and uploading
again is the only real fix.

</details>

## The App

<div style="margin:1.75em 0;padding:16px 20px;border-left:4px solid #2a78d6;border-radius:12px;background:rgb(var(--surface))"><strong>On a Pixel 7a: 1.5 s per SMS, 352 MB, nothing leaves the phone.</strong> Rules, classic ML and the model all run, and each only decides when it's sure.</div>

![Spends: the month, a payment, budgets and capture settings](/assets/posts/from-regex-to-a-small-language-model/app-gallery.webp)

![How the three layers decide in the app](/assets/posts/from-regex-to-a-small-language-model/app-cascade.svg)

![Measured on a Pixel 7a](/assets/posts/from-regex-to-a-small-language-model/app-numbers.svg)

<details style="margin:1.5em 0;padding:2px 20px;border:1px solid rgb(var(--line) / 0.12);border-radius:12px">
<summary style="cursor:pointer;padding:12px 0;font-weight:600;color:rgb(var(--tint))">More: capture, the amount guard, and shipping the model</summary>

Spends asks for SMS access, reads the inbox once on first launch (300 messages
first so this month shows up instantly, then 1,500 at a time), and after that a
small receiver wakes up for every new SMS. Only business senders are read: a
10-digit number is a person, so "I sent you Rs 500" from a friend never gets in.
Every payment keeps the original SMS it came from.

The guard on the language model is my favourite bit: its amount has to appear,
character for character, in the SMS. On the test set it threw out exactly two
answers, and one was a genuine misread (₹1,20,800 for ₹12,080).

The model isn't in the APK. Turn it on, and the app downloads the 352 MB file
from my own server (not Hugging Face, so a repo change can never break the app),
checks its SHA-256, and loads it on first use. The owner's name comes from a
separate "You" row in Settings, just the name. 1.5 seconds per SMS is nothing for
a message that just arrived; for a whole inbox it's hours, so the model reads new
messages only, and re-reading the past is opt-in.

</details>

<details style="margin:1.5em 0;padding:2px 20px;border:1px solid rgb(var(--line) / 0.12);border-radius:12px">
<summary style="cursor:pointer;padding:12px 0;font-weight:600;color:rgb(var(--tint))">More: six walls on the app side</summary>

![Six blockers on the app side](/assets/posts/from-regex-to-a-small-language-model/app-blockers.svg)

The Play Protect one still stings: in India, an SMS app installed from a browser
simply can't be granted the permission it needs. USB install works; a Play Store
listing (with Google's SMS declaration form) is the real fix.

</details>

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
could be: half a billion parameters, one epoch, and a phone-sized file that
beats the regex parser I'd been tuning by hand.

The models are public if you want to poke at them:

- [azabdus/qwen2.5-0.5b-sms-txn](https://huggingface.co/azabdus/qwen2.5-0.5b-sms-txn)
  ([GGUF](https://huggingface.co/azabdus/qwen2.5-0.5b-sms-txn-GGUF),
  [MLX](https://huggingface.co/azabdus/qwen2.5-0.5b-sms-txn-mlx-4bit))
- [azabdus/qwen2.5-1.5b-sms-txn](https://huggingface.co/azabdus/qwen2.5-1.5b-sms-txn)
  ([GGUF](https://huggingface.co/azabdus/qwen2.5-1.5b-sms-txn-GGUF),
  [MLX](https://huggingface.co/azabdus/qwen2.5-1.5b-sms-txn-mlx-4bit))

Remember to send the `owner:` line. Haha, that one cost me two training runs.
