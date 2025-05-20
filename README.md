## Introduction
This project is part of my [personal website](http://philsfun.com) (currently not populated) and can be reached [here](http://philsfun.com/wanikani). It is intended as a way to improve your WaniKani study by allowing you to download WaniKani content as Anki cards. The project is a continuation of my previous project [wanikani-recent-mistakes](https://github.com/math-man-123/wanikani-recent-mistakes) ~~even though that exact feature is currently still missing~~ (it is now implemented!).

## Features
Firstly you can simply view content from any level or srs-stage (e.g. your apprentice items). The view can be filtered by type (radical, kanji, vocabulary) and provides clickable cards linking to their corresponding WaniKani site.

<p align="center"><img src="https://github.com/user-attachments/assets/69c8bef7-3884-4a78-9ccf-b78f895e75c8" alt="view-demo"/></p>

Secondly you can download 3 types of decks from your selected content: Basic (the same as WaniKani), Reversed (instead of 木 -> 'tree' you go 'tree' -> 木), Writing (practice handwriting radicals and kanjis). The Anki cards contain all immediately useful information like meanings, readings, mnemonics, but also link back to the WaniKani site for further info.

## Basic and Reversed cards
Basic and Reversed cards are basically the same, they just switch around the order of their informations a bit. Basic cards are intended to allow you to study srs-stages e.g. apprentice or burned items. Reversed cards are intended to allow you to improve your active vocabulary (as WaniKani only does passive, i.e. reading not speaking).

<p align="center"><img src="https://github.com/user-attachments/assets/70487057-ab5c-4320-ae31-9444890491cd" alt="basic-reversed-demo"/></p>

## Writing cards
Writing cards are intended to allow you to study handwriting radicals and kanji of your current WaniKani level. They feature a customizable animation on the typical square grid used for writing practice. Note these cards need an internet connection as they grab their animation data online!

<p align="center"><img src="https://github.com/user-attachments/assets/df4efb35-04a9-4d64-8ee2-fed5581e14e5" alt="writing-demo"/></p>

## Known Issues
As with most things, this project is not perfect. Please feel free to tell me if you encounter any bad bugs. I will try my best to fix them (maybe). For now there are only two issues known (which are so minor that I don’t want to deal with them):

* A very small amount of items on WaniKani do not use an actual character but rather a custom graphic. Those items will only display a ‘?’ as their character. Similarly some writing cards might display an empty animation as the database that provides them might not know that item.

* The interface state on writing cards is visually not saved between Anki cards, even though the actual settings stay saved. This has to do with how Anki renders cards and doesn’t really matter too much to be honest.
