#! /usr/bin/env python

# implements parts of the xstroke algorithm described here:
# https://www.usenix.org/legacy/events/usenix03/tech/freenix03/full_papers/worth/worth_html/xstroke.html
# for data model, assumes (0,0) is in upper left corner

symbols = []
loadAlphabet()

def getGesture(points):
    points = interpolateGaps(points)
    box = generateBox(points)
    subboxes = classifyPoints(box, points)
    gesture = classifyGesture(subboxes)
    return gesture

def getBox(points):
    points = interpolateGaps(points)
    box = generateBox(points)
    # min(x), min(y), max(x), max(y)
    return [ [box[0], box[1]],
             [box[2], box[1]],
             [box[0], box[3]],
             [box[2], box[3]] ]

def interpolateGaps(points):
    pointsFull = []
    for i in range(len(points) - 1):
        pointsFull.extend( fillGap(points[i], points[i+1]) )
    pointsFull.append(points[len(points)-1])
    return pointsFull

# Interpolates a line from p0 to p1, p1 not included
# implements Bresenham's line algorithm
def fillGap(p0, p1):
    x0 = p0[0]
    y0 = p0[1]
    x1 = p1[0]
    y1 = p1[1]
    points = []
    dx = x1 - x0 
    dy = y1 - y0 
    # special case for a vertical line
    if dx == 0:
        y = range(y0, y1)
        points = [[x0, yi] for yi in y]
        return points

    error = 0.0 # error on y axis
    derror = abs(float(dy)/dx)
    y = y0
    dy = compare(y1, y0)

    for x in range(x0, x1):
        points.append([x, y])
        error += derror
        while error >= 0.5:
            points.append([x, y])
            y += dy
            error -= 1.0
    return points

def generateBox(points):
    x = [pt[0] for pt in points]
    y = [pt[1] for pt in points]
    # no slant angle for now
    return [min(x), min(y), max(x), max(y), 
        max(x) - min(x), max(y) - min(y)]

# | 1 | 2 | 3 |
# | 4 | 5 | 6 |
# | 7 | 8 | 9 |
def classifyPoints(box, points):
    classification = []
    # vertical line
    if box[4] == 0:
        if (points[0][1] < points[len(points)-1][1]):
            return [2, 5, 8]
        else:
            return [8, 5, 2]
    # horizontal line
    if box[5] == 0:
        if (points[0][0] < points[len(points)-1][0]):
            return [4, 5, 6]
        else:
            return [6, 5, 4]

    dx = box[4]/3.0
    dy = box[5]/3.0
    pclasses = []
    for pt in points:
        x = pt[0] - box[0]
        y = pt[1] - box[1]
        xclass = int(x / dx)
        if xclass > 2:
            xclass = 2
        yclass = int(y / dy)
        if yclass > 2:
            yclass = 2
        pclass = yclass*3 + xclass + 1
        pclasses.append(pclass)

    # remove contiguous values
    currVal = None
    for c in pclasses:
        if c != currVal:
            classification.append(c)
            currVal = c
    return classification

def classifyGesture(subboxes):
    searchStr = "".join(subboxes)
    symbol = None
    for sym in symbols:
        match = re.match(sym['regex'], searchStr)
        if match:
            symbol = sym
            break

    if not symbol:
        raise Exception('No symbol was matched')
    if 'key' in symbol:
        print "Key: " + symbol['key']
        return symbol['key']
    else:
        print "Name: " + symbol['name']
        return symbol['name']
    

def classifyGestures(subboxes):
    searchStr = "".join(subboxes)
    matchings = []
    for sym in symbols:
        match = re.match(sym['regex'], searchStr)
        if match:
            matchings.append(sym)

    results = []
    for sym in matchings:
        if 'key' in sym:
            results.append(sym['key'])
            print "Key: " + sym['key']
        else:
            results.append(sym['name'])
            print "Name: " + sym['name']

    if not results:
        raise Exception('No symbols were matched')

    return results

def loadAlphabet():
    alphabet = None
    with open('alphabet.json') as data_file:    
        alphabet = json.load(data_file)
    if not alphabet:
        raise Exception('Alphabet not loaded')

    if 'letters_adv' in alphabet:
        symbols = symbols.extend(alphabet['letters_adv'])
    if 'numbers_adv' in alphabet:
        symbols = symbols.extend(alphabet['numbers_adv'])
    if 'punctuation_adv' in alphabet:
        symbols = symbols.extend(alphabet['punctuation_adv'])
    if not symbols:
        raise Exception('Alphabet not loaded')

# (1, 0, -1)
def compare(p1, p2):
    if p1 > p2:
        return 1
    elif p1 < p2:
        return -1
    else:
        return 0




