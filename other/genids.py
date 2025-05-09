# this code can be used to quickly generate 
# suitable ids to hardcode into anki models
import random


# randomly selects n ids with a minimum gap between
# 1 << 30 and 1 << 31. returns all of them as list
def generate(n, gap=100, start=(1 << 30), end=(1 << 31)):
    ids = list(range(start, end, gap))
    selected = random.sample(ids, n)
    return sorted(selected)


# print 10 ids to copy and paste
for id in generate(10): print(id)
