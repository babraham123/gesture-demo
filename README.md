# gesture-demo
Create a UI and API for xstroke gesture recognition algorithm

The alphabet file consists of a series of mode definitions which will have the following form:
Optional: key, action, name
Within modes, order determines precedence 
```json
{
  "mode_name": [
    {
       "regex": "147?89",
       "name": "letter L",
       "key": "L",
       "action": "ls /home"
    }
  ]
}
```

`regex` is a modern regular expression consisting primarily of the digits '1'-'9'. The regular expression describes the stroke as a path along a 3x3 grid with each cell numbered from 1 to 9 as shown here:
```
        1 2 3
        4 5 6
        7 8 9
```
The extents of the grid will be automatically inferred based on the bounding box of the input stroke. This makes xstroke robust to many stroke distortions including translation and independent scaling along the X and Y axes.

For example, an intuitive stroke for the letter L might be:
```
    Key L = grid ( "14789" )
```
Notice that the digits 14789 trace out an 'L' shape in the 3X3 grid above. This simple stroke is sufficient for defining an basic L, but if you start getting sloppy with your L stroke you might miss the lower-left corner of the grid and end up with 1489. The regular expression syntax makes it easy(?) to define robust strokes by accounting for this slop. For example, you could make the 7 optional like so:
```
    Key L = grid ( "147?89" )
```
