---
title: "T5 fine-tuned"
toc: false
_date: 2022-03-20T21:51:49+05:30
---

{{< summarize >}}

### Motive

At my day job, I handle Customer Support along with other responsiblities. So,
I wanted to train a model (preferably Google's T5) on a custom dataset
(essentially the Support Emails). Once trained, this model will take care of
answering the repetative questions on its own, saving me time to focus on other
works.

I chose `t5-base` model, because I needed a LLM model that will "generate"
answers. There are three types of Quension-Answering models:

- Extractive: Extracts answer from a given context
- Open-domian Generative: Generates answers from a given context. Similar to Extractive
- Closed-book Generative: Generates answer from the training data.

Since the tool will be designed specifically for customer support, I will not
be able to provide any context. T5 models are capable of generating answers
without any context.

```python
# extractive and Open-domain Generative
model = load_model("model name")
context = "English is a Language."
question = "What is English?"

resp = model.predict(context = context, question = question)
# a Language


# Closed-domain Generative
model = load_model("model name")
question = "What is English?"

resp = model.predict(question = question)
# model will generate a suitable answer for this question
```
