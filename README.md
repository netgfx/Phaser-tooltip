# Phaser-tooltip
A Phaser v3 tooltip plugin

Add tooltip to a game object. This plugin can handle simple text, sprite, image or a complex game object.

![sample](https://github.com/netgfx/Phaser-tooltip/blob/main/sample.gif)

# Usage

For use via `import` use the `PhaserTooltip.js` 

For use via `script tag` use the `PhaserTooltip_simple.js`

```
function addTooltip(x, y, item, content, scene) {

    var tooltipID = scene.tooltipID = Math.random() * 10000;
    scene._tooltip = scene.tooltip.createTooltip({
        x: x,
        y: item.getBounds().y - 150,
        hasBackground: false,
        text: {
            text: "Hello Tooltip!"
        },
        background: {
            width: 100,
            height: 50
        },
        id: tooltipID,
        target: item
    });

    scene.tooltip.hideTooltip(tooltipID);
               
    item.setInteractive();

    item.on(
        'pointerover',
            function(pointer, item) {
                scene.tooltip.showTooltip(tooltipID, true);
            },
            scene
    );

    item.on(
        'pointerout',
            function(pointer, item) {
                scene.tooltip.hideTooltip(tooltipID, true);
            },
        scene
    );
}
```

If you want your tooltip to follow your game object add this to the scene update:

```
 if (this._tooltip) {
    var pad = this.tooltip.getPadding(this.tooltipID);
    var hPadding = pad.paddingLeft + pad.paddingRight;
    var targetX = this.tooltip.getTarget(this.tooltipID).getBounds().centerX;

    this._tooltip.x = targetX - (this._tooltip.getBounds().width + hPadding) * 0.5;
    this._tooltip.y = this.tooltip.getTarget(this.tooltipID).getBounds().y - 150;
 }
```

---
<br>

# Options

```
{
    x: 0,
    y: 0,
    hasBackground: false,
    text: {}, // text object
    content: {}, // game object or null
    background:{width: 100, height:50}, // specific background metrics
    id: "myTooltip", // uniqueId -mandatory-
    target: {} // game object that triggers this tooltip
}
```

<strong>Buy me a coffee or tea!</strong> <br>
<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=JCFPKZJ7Y23JJ&lc=GR&item_name=NetGfx%2ecom&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted"><img src="https://www.paypalobjects.com/webstatic/en_US/btn/btn_donate_92x26.png"/></a>

---
### To-Do List:
- Rework architecture to support multiple tooltips on the same target
- More position options (up, down, left, right, leftTop, rightTop, bottomLeft, bottomRight)
- Text multi-line text
- More animation options(?)
