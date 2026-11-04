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
model</strong>, small enough to live on the phone, gets <strong>98.5%</strong>.</blockquote>

<blockquote><strong>Just want to try it?</strong> Open <a href="https://playground.spends.abdus.net">playground.spends.abdus.net</a>, paste a bank SMS (or pick a random one), and see what the model makes of it. The app it runs in, <a href="https://spends.abdus.net">Spends</a>, is in early testing on Android: <a href="https://spends.abdus.net/?utm_source=blog&utm_medium=post&utm_campaign=slm#install">leave your Gmail</a> to try it.</blockquote>

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/cover-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/cover.svg" alt="Reading bank SMS: rules, then classic ML, then a small language model">
</picture>

In India, every rupee that moves sends you an SMS. Card swipe? SMS. UPI to the
chaiwala? SMS. EMI auto-debit at 3 am? SMS. So the most complete record of my
spending is sitting right there in my inbox, just in a format no app can add up.

So I built **Spends**, a small expense tracker with exactly one hard job: read a
bank SMS and, if money moved, write down how much, which way, and to whom. It
took three attempts.

## The Problem

Every SMS that moves money becomes six fields:

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/anatomy-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/anatomy.svg" alt="An SMS and the transaction it becomes">
</picture>

I score one number: **whole-object accuracy**, all six fields right. An expense
with the right amount and the wrong merchant is still a wrong expense.

Sounds simple, right? Except plenty of messages that _look_ like transactions
aren't. A reminder to repay ₹4,735 hasn't paid anything. An OTP for a card
payment is a payment that might happen. Paying your own credit-card bill is
moving money, not spending it. And some real ones fight back: the bank cuts the
merchant's name at 15 letters.

To have answers to check against, I labelled every SMS on my phone: 15,017 of
them, from January 2022 to October 2026. Thirty-three LLM labellers worked
blind from one written guideline, a stronger model relabelled a random 4% from
scratch (it agreed on all 600), and I reviewed by hand the 436 where the labels
and my old parser disagreed.

One rule throughout: **split by date, never randomly.** Banks reuse templates,
so a random split leaks near-copies into the test set and flatters everything.
Train on the past, test on 2026.

## Level 1: Rules

A big Dart file of regular expressions, template by template. Honestly, it works
pretty well: **93.5%** fully right. The last 6.5% is where it hurts. Every new
template needs a new rule, merchants come out right only 91% of the time, and
the biggest single cluster of errors was a lender's repayment reminders, read as
money coming in.

## Level 2: Classic Machine Learning

A **logistic regression** for "is this a transaction?", a **CRF** to tag the
amount and merchant, two small classifiers for the rest. About 2 MB,
microseconds per message, and 99.3% on formats it had seen. Then I tested it the
honest way, on 2026:

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/approaches-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/approaches.svg" alt="Whole-object accuracy on 2026 SMS for each approach">
</picture>

In May 2026 one bank changed one template. That template was a fifth of the test
year, 496 messages, and classic ML had never seen it. Its recall fell to 75%, and
the year to **81%**.

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

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/prompt-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/prompt.svg" alt="The rulebook moves from the prompt into the weights">
</picture>

The untuned model, reading the entire guideline, got **8.1%**. Fine-tuned, with
one trigger word: **97.4%**. And on that new bank template, which the first run
had **zero** examples of, it read **496 of 496**, every amount right.

That's when it clicked. Rules needed someone to write a regex. Classic ML needed
someone to label. The language model just... read it.

The model is **Qwen2.5-0.5B-Instruct** (half a billion parameters, Apache 2.0),
plus its 1.5B sibling to see what size buys. The recipe:

1. **LoRA.** Small rank-16 adapters on every layer instead of retraining all the
   weights. A 35 MB adapter.
2. **Loss on the answer only.** The model reads the SMS but is only graded on
   the JSON it writes. (This matters for privacy, more later.)
3. **Trigger-only prompt.** The system prompt is just `sms_txn_v1`.
4. **One epoch on a free Colab T4.** 23 minutes for the 0.5B.

Adding 60 examples from two weak spots, the way you'd label the first days of a
new bank, took the 0.5B to **98.5%**. The 1.5B reached 99.0%, at 2.5× the size.

### Whose Phone Is It?

`is_transfer` depends on who you are. The prompt never said, so the 1.5B
**memorised my name**: any payment to "MD ABDUS SAMAD" was a transfer, on anyone's
phone. The fix was an `owner:` line in every prompt, and a **made-up owner** in
every training example:

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/owner-swap-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/owner-swap.svg" alt="One labelled SMS becomes several training examples">
</picture>

Transfers to the owner went from 4 of 17 caught to 17 of 17, and my real name
never reaches the weights.

### Looking Inside

To trust a model, I wanted to see it think. So I built a test page: paste an
SMS, get the transaction, see **how sure** the model was of each field, and the
message the way the model sees it, in pieces. It's online at
[playground.spends.abdus.net](https://playground.spends.abdus.net):

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/test-page-tokens-m.webp">
<img src="/assets/posts/from-regex-to-a-small-language-model/test-page-tokens.webp" alt="The test page with the token view turned on">
</picture>

### Running It on the Phone

Bank SMS are about as private as data gets, so the model had to run on the phone: no server, no
API, nothing leaves the device. That set the budget: a download people will accept, about a second
per message, and a phone's CPU.

1. **Size over the last tenth of a point.** The 1.5B is 0.1 points better and almost three times the
   download. The 0.5B won.
2. **The right 4-bit.** Quantized to 4 bits, the 0.5B is 352 MB and scores the same as at 16-bit.
   Q4_K_M is the usual choice, but Q4_0 is the format llama.cpp repacks for ARM: about 4× faster at
   reading the prompt.
3. **llama.cpp inside the app,** through a small native bridge, built for the CPU features phones
   actually have. A build that used one they don't crashed with "illegal instruction".
4. **Downloaded, not bundled.** The app grows by 6.7 MB; the model arrives later, over the air,
   resumable and checksummed.

## What Broke Along the Way

- **The Mac froze.** 32 long prompts at once ate all 16 GB. Small batches and a
  memory cap fixed it; the real training moved to Colab.
- **The T4 says it supports bf16.** It only emulates it. Use fp16 there.
- **Colab looks frozen.** The progress bar stops while the GPU keeps working;
  trust `nvidia-smi`, not the UI.
- **Play Protect says no.** In India it blocks sideloaded apps that read SMS, with
  no override. For now, Spends installs over USB.
- **A whole inbox takes hours.** 13,466 messages at 1.5 s each, and background
  jobs die at 10 minutes. So: new SMS only, answers cached, and re-reading the
  history is opt-in, in 8-minute runs.
- **JNI mangles text.** Java's "modified UTF-8" can't carry every character back
  from C++. Return raw bytes and decode them in Kotlin.

## Training on My SMS, Then Shipping It

The training data is my own SMS, and the model ships inside an app anyone can
download, so I attacked it before shipping. Loss on the answer only
means neither model was ever asked to write an SMS, so there are no messages, account numbers or balances to recite.
For the names of people I'd paid, I sampled blank payees hundreds of times, tried
every two-letter start, and even handed over the first three letters of each real
name. Neither the 0.5B nor the 1.5B wrote a single one.

## The App

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/app-gallery-m.webp">
<img src="/assets/posts/from-regex-to-a-small-language-model/app-gallery.webp" alt="Spends: the month, a payment, budgets and capture settings">
</picture>

In the app, the model doesn't work alone. Rules, classic ML and the model all
look at every new SMS, and each only decides when it's sure. The model goes
first, but its answer counts only if the JSON is valid and the amount literally
appears in the SMS, so a misread ₹1,20,800 for ₹12,080 is thrown out. Classic ML
decides next when it's confident either way, and the rules have the last word.

On a Pixel 7a that's about 1.5 s per SMS, just over a second to load the model,
under 1 GB of memory while it reads, and nothing leaves the phone.

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

Try it at [playground.spends.abdus.net](https://playground.spends.abdus.net), or try
[Spends](https://spends.abdus.net), the Android app it runs in: it's in early testing, so
[leave your Gmail](https://spends.abdus.net/?utm_source=blog&utm_medium=post&utm_campaign=slm#install) and I'll send you the install link.
