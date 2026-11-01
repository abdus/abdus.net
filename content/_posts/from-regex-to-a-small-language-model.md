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

<figure class="not-prose pf">
<div class="pf-split">
<div class="pf-sms"><div class="pf-sms-from">JD-ICICIT-S</div>INR 1,249.00 spent using ICICI Bank Card XX4417 on 14-Oct-26 on AMAZON PAY INDI. Avl Limit: INR 1,82,310.50. If not you, call 1800 2662 …</div>
<div><div class="pf-k">Paid to</div><div style="margin-top:6px;font-size:22px;font-weight:700;letter-spacing:-0.01em">AMAZON PAY INDI</div><div class="pf-v" style="margin-top:14px;font-size:48px">−₹1,249.00</div><div class="pf-n pf-mono" style="margin-top:10px">"is_transfer": false</div></div>
</div>
<div class="pf-cols pf-body">
<div class="pf-col c-rules"><div class="pf-l pf-t" style="margin-top:0">Rules</div><div class="pf-n">regex, 93% whole object</div></div>
<div class="pf-col c-ml"><div class="pf-l pf-t" style="margin-top:0">Classic ML</div><div class="pf-n">LR + CRF, 81% on new formats</div></div>
<div class="pf-col c-lm"><div class="pf-l pf-t" style="margin-top:0">0.5B language model</div><div class="pf-n">fine-tuned, 98.5%, on-phone</div></div>
</div>
<figcaption class="pf-note">Reading bank SMS into transactions: rules, then machine learning, then a small language model</figcaption>
</figure>

In India, every rupee that moves sends you an SMS. Card swipe? SMS. UPI to the
chaiwala? SMS. EMI auto-debit at 3 am? SMS. So the most complete record of my
spending is sitting right there in my inbox, just in a format no app can add up.

So I built **Spends**, a small expense tracker with exactly one hard job: read a
bank SMS and, if money moved, write down how much, which way, and to whom. It
took three attempts. If you only have a minute, this is the whole post:

<figure class="not-prose pf">
<div class="pf-title">The whole post at a glance</div>
<div class="pf-sub">Three ways to read a bank SMS, scored on messages from the future (2026)</div>
<div class="pf-cols pf-body">
<div class="pf-col c-rules"><div style="font-size:17px;font-weight:700">1 · Rules</div><div class="pf-v" style="margin-top:14px;font-size:48px">93%</div><div class="pf-n">transactions fully right</div><div style="margin-top:16px"><div class="pf-k">Good at</div><div style="margin-top:3px">formats someone wrote a rule for</div></div><div style="margin-top:12px"><div class="pf-k">Broke on</div><div style="margin-top:3px">every new template; merchants (91%); knowing who you are</div></div><div class="pf-quote" style="margin-top:14px">“Each fix is easy. There's always another one.”</div></div>
<div class="pf-col c-ml"><div style="font-size:17px;font-weight:700">2 · Classic ML</div><div class="pf-v" style="margin-top:14px;font-size:48px">81%</div><div class="pf-n">fully right (99% on formats it knew)</div><div style="margin-top:16px"><div class="pf-k">Good at</div><div style="margin-top:3px">tiny (2 MB), fast, very precise</div></div><div style="margin-top:12px"><div class="pf-k">Broke on</div><div style="margin-top:3px">one bank's new template: a fifth of the year it had never seen</div></div><div class="pf-quote" style="margin-top:14px">“It only learns with babysitting.”</div></div>
<div class="pf-col c-lm"><div style="font-size:17px;font-weight:700">3 · 0.5B model</div><div class="pf-v" style="margin-top:14px;font-size:48px">98.5%</div><div class="pf-n">fully right, on the phone</div><div style="margin-top:16px"><div class="pf-k">Good at</div><div style="margin-top:3px">reading formats it never saw: 496 of 496 on that new template</div></div><div style="margin-top:12px"><div class="pf-k">Costs</div><div style="margin-top:3px">352 MB, ~1.5 s per SMS, a GPU to train (23 min on a free T4)</div></div><div class="pf-quote" style="margin-top:14px">“It just… read it.”</div></div>
</div>
<div class="pf-note" style="color:rgb(var(--fg))">On the phone today: all three run, in order of trust. The model answers first, classic ML next, rules last.</div>
</figure>

<figure class="not-prose pf">
<div class="pf-stats" style="--cols:4">
<div><div class="pf-v">98.5%</div><div class="pf-l">transactions fully right</div><div class="pf-n">on SMS it never saw (rules: 93%)</div></div>
<div><div class="pf-v">496/496</div><div class="pf-l">new bank format, read right</div><div class="pf-n">zero examples of it in training</div></div>
<div><div class="pf-v">352 MB</div><div class="pf-l">on the phone</div><div class="pf-n">0.5B model, 4-bit, llama.cpp</div></div>
<div><div class="pf-v">23 min</div><div class="pf-l">to train</div><div class="pf-n">one epoch, free Colab T4 GPU</div></div>
</div>
</figure>

## The Problem

<div style="margin:1.75em 0;padding:16px 20px;border-left:4px solid #2a78d6;border-radius:12px;background:rgb(var(--surface))"><strong>One number to watch: whole-object accuracy.</strong> All six fields right. An expense with the right amount and the wrong merchant is still a wrong expense.</div>

<figure class="not-prose pf">
<div class="pf-title">What “reading an SMS” means</div>
<div class="pf-sub">Colours match each field to the words it comes from; the rest are read between the lines</div>
<div class="pf-split pf-body" style="align-items:start">
<div class="pf-sms"><div class="pf-sms-from">AX-ICICIT-S</div>ICICI Bank Acct XX851 <span class="pf-mark c-rules">debited</span> for <span class="pf-mark c-lm">Rs 486.50</span> on <span class="pf-mark c-ml">Zomato Media Pr</span> credited. UPI:629310847215. <span class="pf-muted">Call 18002662 for dispute. SMS BLOCK 851 to 9215676766.</span></div>
<div class="pf-code">{
  <span class="k">"is_txn":</span> true<span class="p">,</span>
  <span class="k">"direction":</span> <span style="color:var(--pf-rules)">"debit"</span><span class="p">,</span>
  <span class="k">"amount":</span> <span style="color:#6aa9f2">486.5</span><span class="p">,</span>
  <span class="k">"currency":</span> "INR"<span class="p">,</span>
  <span class="k">"merchant":</span> <span style="color:var(--pf-ml)">"Zomato Media Pr"</span><span class="p">,</span>
  <span class="k">"is_transfer":</span> false
}</div>
</div>
<div class="pf-note"><b style="color:rgb(var(--fg))">is_txn</b>, <b style="color:rgb(var(--fg))">currency</b> and <b style="color:rgb(var(--fg))">is_transfer</b> are never spelled out: “INR” is implied by “Rs”, and a payment to Zomato is spending, not money moved between your own accounts.</div>
</figure>

Sounds simple, right? Except plenty of messages that _look_ like transactions
aren't:

<figure class="not-prose pf">
<div class="pf-title">Four messages that fool a naive parser</div>
<div class="pf-sub">An amount and a rupee sign don't mean money moved</div>
<div class="pf-cards pf-body" style="--cols:2">
<div class="pf-card"><div style="font-size:15px;line-height:1.55">Keep your credit score healthy! Repay Rs 4,735 by 05-Oct to avoid late fees.</div><div style="margin-top:12px;display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px"><span class="pf-pill c-red">not a transaction</span><span class="pf-n" style="margin:0">a reminder, nothing paid</span></div></div>
<div class="pf-card"><div style="font-size:15px;line-height:1.55">482913 is the OTP for your ICICI Bank Card transaction of INR 2,999.00 at FLIPKART.</div><div style="margin-top:12px;display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px"><span class="pf-pill c-red">not a transaction</span><span class="pf-n" style="margin:0">a payment that might happen</span></div></div>
<div class="pf-card"><div style="font-size:15px;line-height:1.55">Payment of INR 12,840.00 has been received on your Credit Card XX4417. Thank you.</div><div style="margin-top:12px;display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px"><span class="pf-pill c-lm">transfer</span><span class="pf-n" style="margin:0">paying your own bill isn't spending</span></div></div>
<div class="pf-card"><div style="font-size:15px;line-height:1.55">Acct XX851 debited for Rs 640.00 on 12-Oct; BLUE TOKAI COFF credited. UPI:6…</div><div style="margin-top:12px;display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px"><span class="pf-pill c-ml">spending</span><span class="pf-n" style="margin:0">the bank cut the name at 15 letters</span></div></div>
</div>
</figure>

<details style="margin:1.5em 0;padding:2px 20px;border:1px solid rgb(var(--line) / 0.12);border-radius:12px">
<summary style="cursor:pointer;padding:12px 0;font-weight:600;color:rgb(var(--tint))">More: how 15,017 messages got labelled</summary>

Before anything clever, I needed a way to measure. I pulled every SMS off my
phone and labelled all of them:

<figure class="not-prose pf">
<div class="pf-title">How 15,017 messages got labelled</div>
<div class="pf-sub">Machines for the bulk, a second machine to check, a human for the arguments</div>
<div class="pf-stats pf-body" style="--cols:4">
<div><div class="pf-v">15,017</div><div class="pf-l">SMS off the phone</div><div class="pf-n">Jan 2022 – Oct 2026</div></div>
<div><div class="pf-v">33</div><div class="pf-l">blind LLM labellers</div><div class="pf-n">one written guideline, never saw the parser</div></div>
<div><div class="pf-v">600/600</div><div class="pf-l">second-pass agreement</div><div class="pf-n">a stronger model, relabelled a random 4% from scratch</div></div>
<div><div class="pf-v">436</div><div class="pf-l">reviewed by hand</div><div class="pf-n">every label the parser disagreed with</div></div>
</div>
</figure>

One rule throughout: **split by date, never randomly.** Banks reuse templates,
so a random split leaks near-copies into the test set and flatters everything.
Train on the past, test on 2026.

</details>

## Level 1: Rules

<div style="margin:1.75em 0;padding:16px 20px;border-left:4px solid #eb6834;border-radius:12px;background:rgb(var(--surface))"><strong>Rules: 93.5% fully right.</strong> Cheap and predictable, but every new template needs a new rule, and only 91% of merchants come out right.</div>

A big Dart file of regular expressions, template by template. Honestly, it works
pretty well. The last 6.5% is where it hurts:

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/parser-errors-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/parser-errors.svg" alt="Largest error clusters of the regex parser">
</picture>

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

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/approaches-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/approaches.svg" alt="Whole-object accuracy on 2026 SMS for each approach">
</picture>

<figure class="not-prose pf">
<div class="pf-title">One bank changed one template</div>
<div class="pf-sub">Each square is 1% of the 2,648 test SMS from 2026</div>
<div class="pf-split pf-body">
<div class="pf-waffle c-ml" role="img" aria-label="100 squares, 19 of them highlighted"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i></div>
<div><div class="pf-v" style="font-size:56px">1 in 5</div><div class="pf-l" style="font-size:17px">test messages used a format the classic model had never seen</div><div class="pf-sms" style="margin-top:14px;font-size:14px">INR 299.00 is paid from HSBC account XXXXXX2290 to JioHotstar on 05-Oct-26 with ref 528841937206 …</div><div class="pf-n" style="margin-top:12px">496 messages from 17 May 2026 onwards.</div><div class="pf-n">Classic ML recall fell to 75%; the language model read all 496.</div></div>
</div>
</figure>

<details style="margin:1.5em 0;padding:2px 20px;border:1px solid rgb(var(--line) / 0.12);border-radius:12px">
<summary style="cursor:pointer;padding:12px 0;font-weight:600;color:rgb(var(--tint))">More: fresh labels fix it, but someone has to label</summary>

The model had never seen "is paid from … to" mean money going out. A few
confirmed examples of the new template fix it fast:

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/fewshot-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/fewshot.svg" alt="Classic ML recovers quickly with a few fresh labels">
</picture>

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

<figure class="not-prose pf">
<div class="pf-title">The rulebook moves from the prompt into the weights</div>
<div class="pf-sub">Same 0.5B model, same 2,648 SMS from 2026</div>
<div class="pf-split pf-body" style="align-items:start">
<div><div class="pf-k">Before · untuned</div><div class="pf-sms" style="margin-top:8px"><div class="pf-sms-from">system:</div><div class="pf-lines"><i style="width:92%"></i><i style="width:84%"></i><i style="width:96%"></i><i style="width:71%"></i><i style="width:88%"></i><i style="width:64%"></i></div><div class="pf-n">… the whole 2,100-token labelling guideline, then the SMS</div></div><div class="pf-v" style="margin-top:18px;font-size:48px">8.1%</div><div class="pf-n" style="margin-top:8px">whole objects right · 2,216 prompt tokens</div><div class="pf-n">called almost everything a transaction</div></div>
<div class="c-lm"><div class="pf-k">After · fine-tuned</div><div class="pf-sms" style="margin-top:8px"><div class="pf-sms-from">system:</div><div style="font-weight:700;font-size:18px">sms_txn_v1</div><div class="pf-n" style="margin-top:8px">one trigger word; the guideline now lives in the weights</div></div><div class="pf-v" style="margin-top:18px;font-size:48px">97.4%</div><div class="pf-n" style="margin-top:8px">whole objects right · 105 prompt tokens</div><div class="pf-n">twenty times shorter, on the first try</div></div>
</div>
</figure>

The untuned model, reading the entire guideline, got **8.1%**. Fine-tuned, with
one trigger word: **97.4%**. And on that new bank template, which the first run
had **zero** examples of, it read **496 of 496**, every amount right.

That's when it clicked. Rules needed someone to write a regex. Classic ML needed
someone to label. The language model just... read it.

<details style="margin:1.5em 0;padding:2px 20px;border:1px solid rgb(var(--line) / 0.12);border-radius:12px">
<summary style="cursor:pointer;padding:12px 0;font-weight:600;color:rgb(var(--tint))">More: how it was trained</summary>

**Qwen2.5-0.5B-Instruct** (half a billion parameters, Apache 2.0), plus its
1.5B sibling to see what size buys:

<figure class="not-prose pf">
<div class="pf-title">From labelled SMS to a model on the phone</div>
<div class="pf-sub">Everything ran on a free Colab T4 and a 16 GB MacBook</div>
<div class="pf-flow pf-body" style="--cols:5">
<div class="pf-step"><div class="pf-step-t">15,017 SMS</div><div class="pf-step-p">hand-labelled JSON, split by date</div></div>
<div class="pf-step"><div class="pf-step-t">Bundle</div><div class="pf-step-p">chat-format rows, owner names swapped</div></div>
<div class="pf-step c-lm"><div class="pf-step-t">LoRA on Colab</div><div class="pf-step-p">Qwen2.5, T4 GPU, 25–60 min, loss on answer</div></div>
<div class="pf-step"><div class="pf-step-t">Merge + quantise</div><div class="pf-step-p">adapter folded in, MLX 4-bit, GGUF Q4</div></div>
<div class="pf-step"><div class="pf-step-t">Phone</div><div class="pf-step-p">352 MB llama.cpp, no server, no API</div></div>
</div>
<div class="pf-k" style="margin-top:18px">Along the way</div>
<div class="pf-cards" style="--cols:2;margin-top:8px">
<div class="pf-card"><div class="pf-card-t" style="font-size:15.5px">Score</div><div class="pf-card-p" style="margin-top:2px">2,588 future SMS</div></div>
<div class="pf-card"><div class="pf-card-t" style="font-size:15.5px">Hugging Face</div><div class="pf-card-p" style="margin-top:2px">six public repos</div></div>
</div>
</figure>

1. **LoRA.** Small rank-16 adapters on every layer instead of retraining all the
   weights. A 35 MB adapter.
2. **Loss on the answer only.** The model reads the SMS but is only graded on
   the JSON it writes. (This matters for privacy, more later.)
3. **Trigger-only prompt.** The system prompt is just `sms_txn_v1`.
4. **One epoch on a free Colab T4.** 23 minutes for the 0.5B.

Training itself was boringly stable:

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/loss-curves-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/loss-curves.svg" alt="Validation loss during training">
</picture>

</details>

<details style="margin:1.5em 0;padding:2px 20px;border:1px solid rgb(var(--line) / 0.12);border-radius:12px">
<summary style="cursor:pointer;padding:12px 0;font-weight:600;color:rgb(var(--tint))">More: five training runs, and what each one fixed</summary>

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/slm-runs-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/slm-runs.svg" alt="Whole-object accuracy across five training runs">
</picture>

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

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/transfers-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/transfers.svg" alt="Transfers to the owner caught, before and after the owner line">
</picture>

<details style="margin:1.5em 0;padding:2px 20px;border:1px solid rgb(var(--line) / 0.12);border-radius:12px">
<summary style="cursor:pointer;padding:12px 0;font-weight:600;color:rgb(var(--tint))">More: the made-up owners, and the bug they caused</summary>

<figure class="not-prose pf">
<div class="pf-title">One labelled SMS, three training examples</div>
<div class="pf-sub">The real owner's name never reaches the model; a made-up owner takes its place every time</div>
<div class="pf-body" style="display:grid;gap:12px">
<div class="pf-card"><div class="pf-k">Labelled</div><div class="pf-mono" style="margin-top:6px">…debited by 2000.00 … trf to &lt;OWNER'S NAME&gt; Refno 6280…</div><div class="pf-mono pf-n">"merchant": "&lt;OWNER'S NAME&gt;", "is_transfer": true</div></div>
<div class="pf-card c-lm"><div class="pf-k">Copy 1</div><div class="pf-mono" style="margin-top:6px">owner: Maitee Thudagee (UPI: maitee.thudagee@okaxis)</div><div class="pf-mono">…debited by 2000.00 … trf to MAITEE THUDAGEE Refno 6280…</div><div class="pf-mono pf-n">→ "is_transfer": true · payee is the owner</div></div>
<div class="pf-card c-rules"><div class="pf-k">Copy 2</div><div class="pf-mono" style="margin-top:6px">owner: Rekha Rani Naidu (UPI: rekha.naidu@ybl)</div><div class="pf-mono">…debited by 2000.00 … trf to MAITEE THUDAGEE Refno 6280…</div><div class="pf-mono pf-n">→ "is_transfer": false · payee is someone else</div></div>
</div>
</figure>

Now it has to _compare_ the payee with the owner. The catch: merchant accuracy
slipped a little. The made-up names came from short lists, so the model started
"correcting" real names towards familiar ones, an extra L here, a vowel there.

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

<picture>
<source media="(max-width: 640px)" srcset="/assets/posts/from-regex-to-a-small-language-model/size-vs-accuracy-m.svg">
<img src="/assets/posts/from-regex-to-a-small-language-model/size-vs-accuracy.svg" alt="Download size against accuracy">
</picture>

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

<figure class="not-prose pf">
<div class="pf-title">What broke along the way</div>
<div class="pf-sub">Six walls I hit training a language model on a laptop and a free GPU</div>
<div class="pf-cards pf-body" style="--cols:3">
<div class="pf-card"><div class="pf-card-t">The Mac froze</div><div class="pf-card-p">32 long prompts at once ate all 16 GB of memory.</div><div class="pf-card-fix"><b>Fix:</b> cap MLX memory, small batches, train on Colab.</div></div>
<div class="pf-card"><div class="pf-card-t">The T4 lies about bf16</div><div class="pf-card-p">is_bf16_supported() says True; it only emulates it.</div><div class="pf-card-fix"><b>Fix:</b> check compute capability 8+, use fp16 on a T4.</div></div>
<div class="pf-card"><div class="pf-card-t">Colab looks frozen</div><div class="pf-card-p">The progress bar stops while the GPU keeps working at 100%.</div><div class="pf-card-fix"><b>Fix:</b> trust nvidia-smi in the Colab terminal, not the UI.</div></div>
<div class="pf-card"><div class="pf-card-t">Free GPUs run out</div><div class="pf-card-p">After ~3 hours of training in a day, Colab hands out no more T4s.</div><div class="pf-card-fix"><b>Fix:</b> wait for the quota to reset, or pay for compute units.</div></div>
<div class="pf-card"><div class="pf-card-t">Banks it never saw</div><div class="pf-card-p">With no HDFC debits in training, the 0.5B misses HDFC debits.</div><div class="pf-card-fix"><b>Fix:</b> more banks in the data; size alone helps a little.</div></div>
<div class="pf-card"><div class="pf-card-t">The sender isn't text</div><div class="pf-card-p">JM-HSBCIN-S comes as SMS metadata; a pasted message doesn't have it.</div><div class="pf-card-fix"><b>Fix:</b> train with the sender missing a quarter of the time.</div></div>
</div>
</figure>

## Training on My SMS, Then Publishing It

<div style="margin:1.75em 0;padding:16px 20px;border-left:4px solid #1baf7a;border-radius:12px;background:rgb(var(--surface))"><strong>0 names extracted.</strong> I attacked both public models for the names of people I'd paid. Neither gave up a single one.</div>

<figure class="not-prose pf">
<div class="pf-title">What can a stranger pull out of the public model?</div>
<div class="pf-sub">I attacked my own models before publishing them</div>
<div class="pf-rows pf-body">
<div class="pf-row"><div><span class="pf-pill c-ml">safe</span></div><div><div style="font-size:16.5px;font-weight:700">Message text, account numbers, balances, OTPs</div><div class="pf-n" style="margin-top:4px">The model was only graded on its JSON answer, never asked to write an SMS. Nothing to recite.</div></div></div>
<div class="pf-row"><div><span class="pf-pill c-ml">0 found</span></div><div><div style="font-size:16.5px;font-weight:700">Names of people I paid (650 in training)</div><div class="pf-n" style="margin-top:4px">Blank payees sampled hundreds of times, every two-letter start, even the first three letters of each real name: neither the 0.5B nor the 1.5B wrote any of them.</div></div></div>
<div class="pf-row"><div><span class="pf-pill c-miss">fixed</span></div><div><div style="font-size:16.5px;font-weight:700">My own name</div><div class="pf-n" style="margin-top:4px">The first 1.5B memorised it. The owner-line models never see it; old uploads were deleted.</div></div></div>
</div>
</figure>

<details style="margin:1.5em 0;padding:2px 20px;border:1px solid rgb(var(--line) / 0.12);border-radius:12px">
<summary style="cursor:pointer;padding:12px 0;font-weight:600;color:rgb(var(--tint))">More: a Hugging Face gotcha</summary>

**Squashing a repo's history doesn't delete old uploads.** They vanish from the
commit list but still download by commit hash. Deleting the repo and uploading
again is the only real fix.

</details>

## The App

<div style="margin:1.75em 0;padding:16px 20px;border-left:4px solid #2a78d6;border-radius:12px;background:rgb(var(--surface))"><strong>On a Pixel 7a: 1.5 s per SMS, 352 MB, nothing leaves the phone.</strong> Rules, classic ML and the model all run, and each only decides when it's sure.</div>

![Spends: the month, a payment, budgets and capture settings](/assets/posts/from-regex-to-a-small-language-model/app-gallery.webp)

<figure class="not-prose pf">
<div class="pf-title">All three still run, in order of trust</div>
<div class="pf-sub">How Spends decides on each new SMS; each layer only answers when it's sure</div>
<div class="pf-body">
<div class="pf-sms" style="display:inline-block"><b>New SMS</b> <span class="pf-n" style="margin-left:6px">business senders only</span></div>
<div class="pf-between" style="text-align:left;padding-left:18px">↓</div>
<div class="pf-card c-lm"><div class="pf-card-t">1 · Language model (opt-in, 352 MB)</div><div class="pf-card-p">Answers first, but only counts if its JSON is valid and its amount literally appears in the SMS, so a misread ₹1,20,800 for ₹12,080 is thrown out. Runs only on SMS that quote an amount.</div></div>
<div class="pf-between">not sure ↓</div>
<div class="pf-card c-ml"><div class="pf-card-t">2 · Classic ML (on by default, 1.95 MB, updated over the air)</div><div class="pf-card-p">P(payment) ≥ 0.8: its answer. ≤ 0.05: not a payment, even if the rules disagree. Anything in between, usually a format it hasn't seen, falls through.</div></div>
<div class="pf-between">not sure ↓</div>
<div class="pf-card c-rules"><div class="pf-card-t">3 · Rules (always run)</div><div class="pf-card-p">The last word. They also always pull the account number and UPI reference, whichever layer decided the rest.</div></div>
</div>
<div class="pf-note">Every model answer is cached per SMS, so re-scans and restores never re-run the model or quietly fall back to the rules.</div>
</figure>

<figure class="not-prose pf">
<div class="pf-title">On a real phone</div>
<div class="pf-sub">Measured on a Pixel 7a, Q4_0 model, llama.cpp, 4 threads</div>
<div class="pf-stats pf-body" style="--cols:3">
<div><div class="pf-v">1.5 s</div><div class="pf-n" style="margin-top:8px">per SMS inside the app</div></div>
<div><div class="pf-v">1.17 s</div><div class="pf-n" style="margin-top:8px">to load the model, cold</div></div>
<div><div class="pf-v">377 / 58</div><div class="pf-n" style="margin-top:8px">tokens/s reading / writing</div></div>
<div><div class="pf-v">98.7%</div><div class="pf-n" style="margin-top:8px">whole object, 2,588 test SMS (rules 95.3%)</div></div>
<div><div class="pf-v">+6.7 MB</div><div class="pf-n" style="margin-top:8px">APK size for llama.cpp (model downloaded)</div></div>
<div><div class="pf-v">971 MB</div><div class="pf-n" style="margin-top:8px">memory while reading, ~3.4 cores</div></div>
</div>
</figure>

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

<figure class="not-prose pf">
<div class="pf-title">Putting a language model in a Flutter app</div>
<div class="pf-sub">Six more walls, this time on the phone</div>
<div class="pf-cards pf-body" style="--cols:3">
<div class="pf-card"><div class="pf-card-t">Play Protect says no</div><div class="pf-card-p">In India it blocks sideloaded apps that ask for SMS access. No override.</div><div class="pf-card-fix"><b>Fix:</b> install over USB for now; a Play Store listing for real.</div></div>
<div class="pf-card"><div class="pf-card-t">Q4_K_M is too slow</div><div class="pf-card-p">About 2 s per SMS on the phone.</div><div class="pf-card-fix"><b>Fix:</b> Q4_0, which llama.cpp repacks for ARM: ~4× faster prompt reading.</div></div>
<div class="pf-card"><div class="pf-card-t">“Illegal instruction”</div><div class="pf-card-p">A build using i8mm crashed: the phone's cores don't have it.</div><div class="pf-card-fix"><b>Fix:</b> build for dotprod + fp16, check the CPU before loading.</div></div>
<div class="pf-card"><div class="pf-card-t">A whole inbox is hours</div><div class="pf-card-p">13,466 messages at ~1.5 s each; background jobs die at 10 minutes.</div><div class="pf-card-fix"><b>Fix:</b> new SMS only, cached answers, opt-in re-read in 8-minute runs.</div></div>
<div class="pf-card"><div class="pf-card-t">352 MB over a bad route</div><div class="pf-card-p">One connection crawled at ~0.7 MB/s, roughly 8 minutes.</div><div class="pf-card-fix"><b>Fix:</b> 4 parallel range requests, resumable, SHA-256 checked.</div></div>
<div class="pf-card"><div class="pf-card-t">JNI mangles text</div><div class="pf-card-p">Java's “modified UTF-8” can't carry every character back from C++.</div><div class="pf-card-fix"><b>Fix:</b> return raw UTF-8 bytes, decode them in Kotlin.</div></div>
</div>
</figure>

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
