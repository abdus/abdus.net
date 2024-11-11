---
draft: false
meta:
  image: /images/a41f9d00c5c8b8890d2d5788cf19a801.jpg
  description: Creating a simple duplicate file finder with an algorithmic
    approach using GNU Bash. This post is focused on how coding something by
    keeping algorithmic thinking in mind would make it better
featured: false
title: Finding Duplicate Files in Linux - The Hard Way
date: 2020-07-11T21:53:45+05:30
tags:
  - algorithms
  - bash
categories:
  - linux
tableofcontents: true
---

Duplicate files, in Layman's term, are the files which are exactly a copy of
one another. For example, if we have two files _biz_ A and B; A would be a
duplicate of B if it has the same content as file B.

Duplicates are generally unavoidable. No matter what you do, you would always
end up getting a few of them. Going through the whole file system and finding
them one by one is a tedious job. And no sane person would ever think of doing
that manually when the file count is literally in thousands.

Filtering them out and removing is quite easy though. All you need to do is
install some tools like [`rdfind`](https://rdfind.pauldreik.se/), [`fslint`](https://www.pixelbeat.org/fslint/) etc. Run a few commands, and
duplicates would vanish. [Here is a guide](https://www.tecmint.com/find-and-delete-duplicate-files-in-linux/) to help you out.

If that's what you are here for, you won't have to read any further. Download
any one of those tools and get your job done. This post emphasizes on how to
**build one such tool** for your use :)

## 1. Comparing File Content

The first way is to compare the contents of one file with all available files in
that directory. So, if you have like 10 files: choose a random file and read its
content. Store its content in a variable. Loop through rest of the files and
compare their contents with the one you have stored in a variable. If matches,
delete that file. If not, move on.

A simple code example would help better in understanding (for simplicity, I am
ignoring directories):

```bash
#!/bin/bash

# program to find a duplicate
# public key file

for f in `ls -p | grep -v /`      # filter files
do
  f_CONTENT=`cat "$f"`;
  for g in `ls -p | grep -v /`
  do
    g_CONTENT=`cat "$g"`
    if [[ $f_CONTENT == $g_CONTENT && $f != $g ]]; then
      # duplicate
      echo "DUPLICATE: $f === $g";
    fi
  done
done
```

As you might have already understood how resource hungry this program would be.
I mean, it is not. But compared to other possible ways, it's a resource-hungry
process.

This program would have a time **complexity of O(n^2)**. Not ideal.

### Limitations

So, here's a summary of why I think this approach is bad:

- Takes up more resources than it should
- Have a complexity of O(n^2)

## 2. Using Hashing Technique

My second option is to use file-hash. This method would be quite similar to
the previous one, except that instead of storing file content, I would be
storing the hash value of that content :)

If you are wondering what a hash is; well, it is a unique string of alphanumeric
characters generated from a given object.

For a given object(like ASCII characters, binary files etc), the generated hash
would always be the same. Change a character(even space), and it would differ.

Generation of hash is done by using algorithms. You feed an algorithm
with data, and it calculates the hash value of that data. There are
so many hashing algorithms that are available out there. A few among them are
SHA, BlowFish, MD5 etc which are quite popular.

One more unique thing about hash is, it is irreversible. You can't extract the
content from which the hash was generated.

> Note that, this method won't give much better result over the previous method as hashing is a slow process and it _does_ consume a lot of resources.

In Linux, there are tools for generating a hash of any given files. In most of the
distributions, they are pre-installed.

Following is a Bash Script which would implement whatever I said so far.

```bash
#!/bin/bash

# find duplicate using hashing technique
for f in `ls -p | grep -v /`
do
  f_sha=`sha1sum "$f" | awk '{ print $1 }'`;
  for g in `ls -p | grep -v /`
  do
    g_sha=`sha1sum "$g" | awk '{ print $1 }'`

    if [[ $f_sha == $g_sha && $f != $g ]]; then
      # duplicate
      echo "SAME: $f === $g";
    fi
  done
done
```

As you can see, it does not make any huge difference. Worse, it adds an extra
step of calculating SHA1SUM of each file.

## 3. Maps (or HashMaps)

Or Dictionary, Object, Associative array, HashTable ... whatever you call them.
Hashmaps are a collection of pairs of key-value stored inside a variable. One
prominent benefit of the hashtable is that **complexity of searching an element is O(1)**. Read more about hash-table on [Wikipedia](https://en.wikipedia.org/wiki/Hash_table).

What does this mean? I could **reduce the time complexity of my code to O(n)**.

## Combining Everything ...

Since I can combine the hashing technique(mentioned in the previous method) with
HashTable, the program would be more efficient and simple. I won't have to use
two `for` loops. This would also reduce time complexity.

I am not using file content as key in hashtable. I could have stored either
a file name or file content as a key. But neither of then would work.

- Two files would never have the same name under a single context.
- File content could be of any type, ranging from ASCII to Multimedia etc.
  This does not make it ideal for using as Key.
- Just imagine, what if the file size is huge.. HUGE? like 2 or 3 GB! Or more!
  it would increase the space needed by the program to run, ultimately increasing
  the resource consumption.

So, I will be using SHA1SUM(generated using `sha1sum` tool) as key. For value,
I would just set it to `true` since it does not matter what value it
holds.

Since v4.0, Bash provides a native way of creating HashTables. I won't have to
look for another language to write this small program.

Enough explaining, here is the code:

```bash
#!/bin/bash

declare -A checksums   # `checksums` is a hash-table

for f in `ls -pS | grep -v /`
do
  file_hash=`sha1sum "$f" | awk '{ print $1 }'`
  if [[ "${checksums[$file_hash]}" == true ]]; then
    echo "DUP: $f"
  else
    checksums[$file_hash]=true;
  fi
done
```

## Conclusion

There is no point in reinventing the wheel. There are so many popular tools for
finding and removing duplicates from the file system. Use any one of them.

I am learning algorithms. So, I thought of explaining some stuff which would help
me understand it better. Hence, this article.
