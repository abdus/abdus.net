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

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/cover-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/cover.svg" alt="Reading bank SMS: rules, then classic ML, then a small language model">
</picture>

In India, every rupee that moves sends you an SMS. Card swipe? SMS. UPI to the
chaiwala? SMS. EMI auto-debit at 3 am? SMS. So the most complete record of my
spending is sitting right there in my inbox, just in a format no app can add up.

So I built **Spends**, a small expense tracker with exactly one hard job: read a
bank SMS and, if money moved, write down how much, which way, and to whom. It
took three attempts. If you only have a minute, this is the whole post:

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/at-a-glance-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/at-a-glance.svg" alt="The whole post at a glance">
</picture>

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/headline-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/headline.svg" alt="Headline numbers">
</picture>

## The Problem

<div style="margin:1.75em 0;padding:16px 20px;border-left:4px solid #2a78d6;border-radius:12px;background:rgb(var(--surface))"><strong>One number to watch: whole-object accuracy.</strong> All six fields right. An expense with the right amount and the wrong merchant is still a wrong expense.</div>

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/anatomy-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/anatomy.svg" alt="An SMS and the transaction it becomes">
</picture>

Sounds simple, right? Except plenty of messages that _look_ like transactions
aren't:

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/tricky-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/tricky.svg" alt="Four tricky messages">
</picture>

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/labelling-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/labelling.svg" alt="How the messages were labelled">
</picture>

One rule throughout: **split by date, never randomly.** Banks reuse templates,
so a random split leaks near-copies into the test set and flatters everything.
Train on the past, test on 2026.

## Level 1: Rules

<div style="margin:1.75em 0;padding:16px 20px;border-left:4px solid #eb6834;border-radius:12px;background:rgb(var(--surface))"><strong>Rules: 93.5% fully right.</strong> Cheap and predictable, but every new template needs a new rule, and only 91% of merchants come out right.</div>

A big Dart file of regular expressions, template by template. Honestly, it works
pretty well. The last 6.5% is where it hurts:

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/parser-errors-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/parser-errors.svg" alt="Largest error clusters of the regex parser">
</picture>


## Level 2: Classic Machine Learning

<div style="margin:1.75em 0;padding:16px 20px;border-left:4px solid #1baf7a;border-radius:12px;background:rgb(var(--surface))"><strong>Classic ML: 99.3% on formats it knew, 81% on the future.</strong> One bank changed one template, and a fifth of the year fell through the floor.</div>

A **logistic regression** for "is this a transaction?", a **CRF** to tag the
amount and merchant, two small classifiers for the rest. About 2 MB,
microseconds per message. Then I tested it the honest way, on 2026:

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/approaches-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/approaches.svg" alt="Whole-object accuracy on 2026 SMS for each approach">
</picture>

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/waffle-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/waffle.svg" alt="One in five test messages used a new format">
</picture>


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

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/prompt-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/prompt.svg" alt="The rulebook moves from the prompt into the weights">
</picture>

The untuned model, reading the entire guideline, got **8.1%**. Fine-tuned, with
one trigger word: **97.4%**. And on that new bank template, which the first run
had **zero** examples of, it read **496 of 496**, every amount right.

That's when it clicked. Rules needed someone to write a regex. Classic ML needed
someone to label. The language model just... read it.

**Qwen2.5-0.5B-Instruct** (half a billion parameters, Apache 2.0), plus its
1.5B sibling to see what size buys:

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/pipeline-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/pipeline.svg" alt="From labelled SMS to a model on the phone">
</picture>

1. **LoRA.** Small rank-16 adapters on every layer instead of retraining all the
   weights. A 35 MB adapter.
2. **Loss on the answer only.** The model reads the SMS but is only graded on
   the JSON it writes. (This matters for privacy, more later.)
3. **Trigger-only prompt.** The system prompt is just `sms_txn_v1`.
4. **One epoch on a free Colab T4.** 23 minutes for the 0.5B.


<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/slm-runs-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/slm-runs.svg" alt="Whole-object accuracy across five training runs">
</picture>

- **Run 2** added 60 examples from two weak banks, the way you'd label the
  first days of a new one.
- **Run 3** tried the 1.5B: 99.0%, at 2.5× the size.
- **Runs 4 and 5** fixed transfers (next section).

### Whose Phone Is It?

<div style="margin:1.75em 0;padding:16px 20px;border-left:4px solid #2a78d6;border-radius:12px;background:rgb(var(--surface))"><strong>Transfers to the owner: 4 of 17 → 17 of 17.</strong> Once the prompt says whose phone it is, and my real name never reaches the training data.</div>

`is_transfer` depends on who you are. The prompt never said, so the 1.5B
**memorised my name**: any payment to "MD ABDUS SAMAD" was a transfer, on anyone's
phone. The fix was an `owner:` line in every prompt, and a **made-up owner** in
every training example:

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/transfers-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/transfers.svg" alt="Transfers to the owner caught, before and after the owner line">
</picture>

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/owner-swap-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/owner-swap.svg" alt="One labelled SMS becomes several training examples">
</picture>


### Looking Inside

To trust a model, I wanted to see it think. So I built a test page: paste an
SMS, get the transaction, see **how sure** the model was of each field, and the
message the way the model sees it, in pieces:

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/test-page-tokens-m.webp">
<img src="/assets/posts/from-regex-to-a-small-language-model/test-page-tokens.webp" alt="The test page with the token view turned on">
</picture>


### Making It Phone-Sized

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/size-vs-accuracy-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/size-vs-accuracy.svg" alt="Download size against accuracy">
</picture>


## What Broke Along the Way

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/blockers-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/blockers.svg" alt="Five things that broke along the way">
</picture>

## Training on My SMS, Then Publishing It

<div style="margin:1.75em 0;padding:16px 20px;border-left:4px solid #1baf7a;border-radius:12px;background:rgb(var(--surface))"><strong>0 names extracted.</strong> I attacked both public models for the names of people I'd paid. Neither gave up a single one.</div>

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/privacy-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/privacy.svg" alt="What a stranger can and can't extract">
</picture>


## The App

<div style="margin:1.75em 0;padding:16px 20px;border-left:4px solid #2a78d6;border-radius:12px;background:rgb(var(--surface))"><strong>On a Pixel 7a: 1.5 s per SMS, 352 MB, nothing leaves the phone.</strong> Rules, classic ML and the model all run, and each only decides when it's sure.</div>

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/app-gallery-m.webp">
<img src="/assets/posts/from-regex-to-a-small-language-model/app-gallery.webp" alt="Spends: the month, a payment, budgets and capture settings">
</picture>

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/app-cascade-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/app-cascade.svg" alt="How the three layers decide in the app">
</picture>

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/app-numbers-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/app-numbers.svg" alt="Measured on a Pixel 7a">
</picture>


<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/app-blockers-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/app-blockers.svg" alt="Six blockers on the app side">
</picture>


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
