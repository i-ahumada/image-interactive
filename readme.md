# INTERACTIVE IMAGES - DOCS
# <image-interactive\>
This element serves the purpose of containing several `signal-popup` elements and the image that goes beneath them. _**The height and width values must be defined for proper functionality**_.

## Attributes

### # src
Src is a _String_ value that has the source of the image that will be displayed. It functions the same way as the src attribute for the ´img´ element.

### # height 
Height is an _Integer_ value that sets the image height value in pixels.

### # width
Width is an _Integer_ value that sets the image width value in pixels.

# <signal-popup\>
This elements constitutes a single pair of a clickable element that triggers the appearence of a popup. It's functionality is that of the `SinalPopup` class defined in index.js. The most important thing to understand about this element are the attributes which are shared between the "signal" (clickable component of the element) and the "popup" (element connected to the signal that appears on signal click, for each attribute there are default values that prevent errors if the attribute isn't set. 

* The signal attributes are: `shape`, `color`, `border`, `signalsize`, `coords` and `icon`.
* The popup attributes are: `padding`, `title`, `description` , `image`, `is360`, `height`, `width`, `textwidth`, `font` and `position`.

Popup can either be configured with the title description and image attributes or you can add html inside the `<signal-popup>` element and it will be treated as the inner html of the popup. If any html elements are written inside the `<signal-popup>` element it will render the html rather than what has been set through the attributes since custom html is of higher priority. Example:

            <image-interactive ...>
                        <signal-popup title="This will not be rendered :(" image="./JohnCena.jpg">
                                    <h1>This will!</h1>
                        </signal-popup>
            </image-interactive>

## Attributes

### # shape
Shape is a _String_ value that currently accepts three possible options `square`, `circle` and `rhombus`. If the attribute isn't set to either `circle` or `rhombus` it defaults to `square`.

### # color
Color functions exactly like the color or background-color css properties. You can pass a hexadecimal value, a color name or use css type declarations like  `rgba(23,43,12,0.5)`. If the value isn't set it defaults to `grey`.

### # border
Border is a _Boolean_ value meaning it can take either  `true` or `false`, `true` means the signal gets a border (`border: 4px solid black`). If the attribute isn't set it defaults to `false`.

### # signalsize
Signalsize is an _Integer_. Internally it is the amount of pixels of padding a signal gets. If the attribute isn't set it defaults to `5`.

### # coords
Coords is a _String_ that has to be writte like this `L,T` only replace N and M with numbers (either a `float` or `int`) lower than 100. The coords attribute represent the left and top displacement of the signal as a percentage. To further clarify this attribute a few examples:

            <image-interactive>
                        // Set signal-popup 50% away from the left side of the screen 
                        // and 50% away from the topside top
                        <signal-popup coords="50,50"></signal-popup>
                        
                        // Set signal-popup 20% away from the left side of the screen 
                        // and 90% away from the topside top
                        <signal-popup coords="20,90"></signal-popup>
                        
                        // Set signal-popup 43.3% away from the left side of the screen 
                        // and 23.43% away from the topside top
                        <signal-popup coords="43.3,23.43"></signal-popup>
            </image-interactive>

If the attribute isn't set it defaults to `0,0`.

### # padding
Padding is an _Integer_ that represents the internal padding of the popup. If the attribute isn't set it defaults to `5`.

### # title
Title is a _String_ value that represents the predifined popup structure title. If the attribute isn't set it defaults to an empty string.

### # description
Title is a _String_ value that represents the predifined popup structure description. If the attribute isn't set it defaults to an empty string.

### # textwidth
Textwidth in an _Integer_ sets the horizontal space the predifined popup structure text takes in pixels. If the attribute isn't set it defaults to an empty value which is treated as `auto`.

### # image
Image is a _String_ value that represents the path to the predifined popup structure image or in combination with the `is360` attribute you can pass in a link to an online 360 image viewer and the image gets rendered instead of the common structure. If the attribute isn't set it defaults to an empty string.

### # is360
Is360 is a _Boolean_ value that checks if the path set on `ìmage` is a link to an online 360 image viewer or not. If the attribute isn't set it defaults to `false`.

### # height
Height is  a _Integer_ value it represents the height in pixels of the image passed in on the `image` attribute or the height of the popup if the image is a path to an online 360 image viewer. If the attribute isn't set it defaults to an empty value which is treated as `auto`.

### # width
Width is  a _Integer_ value it represents the width in pixels of the image passed in on the `image` attribute or the width of the popup if the image is a path to an online 360 image viewer. If the attribute isn't set it defaults to an empty value which is treated as `auto`.

### # font
Font is a _String_ value that affects the predifined popup structure text. If the attribute isn't set it defaults to `Sans-serif`.

### # position
Position is a _String_ value that takes one of two options `top` or `bottom` which makes the popup appear above the signal or below it respectively. If the attribute isn't set it defaults to `bottom`.
