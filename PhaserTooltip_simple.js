class PhaserTooltip {

    constructor(scene, pluginManager) {


        /**
         * A handy reference to the Plugin Manager that is responsible for this plugin.
         * Can be used as a route to gain access to game systems and  events.
         *
         * @name Phaser.Plugins.BasePlugin#pluginManager
         * @type {Phaser.Plugins.PluginManager}
         * @protected
         * @since 3.8.0
         */
        this.pluginManager = pluginManager;

        /**
         * A reference to the Game instance this plugin is running under.
         *
         * @name Phaser.Plugins.BasePlugin#game
         * @type {Phaser.Game}
         * @protected
         * @since 3.8.0
         */
        this.game = pluginManager.game;

        /**
         * A reference to the Scene that has installed this plugin.
         * Only set if it's a Scene Plugin, otherwise `null`.
         * This property is only set when the plugin is instantiated and added to the Scene, not before.
         * You cannot use it during the `init` method, but you can during the `boot` method.
         *
         * @name Phaser.Plugins.BasePlugin#scene
         * @type {?Phaser.Scene}
         * @protected
         * @since 3.8.0
         */
        this.scene = scene;

        /**
         * A reference to the Scene Systems of the Scene that has installed this plugin.
         * Only set if it's a Scene Plugin, otherwise `null`.
         * This property is only set when the plugin is instantiated and added to the Scene, not before.
         * You cannot use it during the `init` method, but you can during the `boot` method.
         *
         * @name Phaser.Plugins.BasePlugin#systems
         * @type {?Phaser.Scenes.Systems}
         * @protected
         * @since 3.8.0
         */
        this.systems = scene.sys;

        /**
         * The Sticks that this plugin is responsible for.
         * @type {Set}
         */
        this.sticks = null;

        /**
         * The Buttons that this plugin is responsible for.
         * @type {Set}
         */
        this.buttons = null;

        /**
         * Internal var to track the Input pointer total.
         * @type {integer}
         * @private
         */
        this._pointerTotal = 0;

        scene.sys.events.once('boot', this.boot, this);

        this.tooltipCollection = {};
        this.target = null;
    }

    /**
     * The boot method.
     *
     * @private
     */
    boot() {
        this.systems.events.once('destroy', this.destroy, this);

        //  Because they may load the plugin via the Loader
        if (this.systems.settings.active) {
            this.start();
        } else {
            this.systems.events.on('start', this.start, this);
        }
    }

    start() {


        this.systems.events.on('update', this.update, this);
        this.systems.events.once('shutdown', this.shutdown, this);
    }

    /**
     * Called automatically by the Phaser Plugin Manager.
     *
     * Updates all Stick and Button objects.
     *
     * @param {integer} time - The current game timestep.
     */
    update(time) {

    }

    /**
     * Shuts down the event listeners for this plugin.
     */
    shutdown() {
        const eventEmitter = this.systems.events;

        eventEmitter.off('update', this.update, this);
        eventEmitter.off('shutdown', this.shutdown, this);
    }

    /**
     * Removes and calls `destroy` on all Stick and Button objects in this plugin.
     */
    destroy() {
        this.shutdown();

        // clean up //

    }

    test() {
        console.log("test!");
    }

    hideTooltip(id, animate) {

        if (animate) {
            let isTweening = this.scene.tweens.isTweening(this.tooltipCollection[id].container);
            if (isTweening) {
                this.scene.tweens.killTweensOf(this.tooltipCollection[id].container);
            }

            this.tween = this.scene.tweens.add({
                targets: this.tooltipCollection[id].container,
                alpha: 0,
                ease: 'Power1',
                duration: 250,
                delay: 0,
                onComplete: o => {
                    //this.tween = null;
                },
            });

        } else {
            this.tooltipCollection[id].container.visible = false;
        }
    }

    showTooltip(id, animate) {

        if (animate) {
            this.tooltipCollection[id].container.alpha = 0;
            this.tooltipCollection[id].container.visible = true;
            this.scene.children.bringToTop(this.tooltipCollection[id].container);

            let isTweening = this.scene.tweens.isTweening(this.tooltipCollection[id].container);
            if (isTweening) {
                this.scene.tweens.killTweensOf(this.tooltipCollection[id].container);
            }

            this.tween = this.scene.tweens.add({
                targets: this.tooltipCollection[id].container,
                alpha: 1,
                ease: 'Power1',
                duration: 500,
                delay: 0,
                onComplete: o => {
                    //this.tween = null;
                },
            });
        } else {
            this.tooltipCollection[id].container.visible = true;
            this.scene.children.bringToTop(this.tooltipCollection[id].container);
        }
    }

    /**
     *
     *
     * @param {*} options
     * @memberof FloatingTextUI
     */
    createTooltip(options) {

        let background;

        let container = this.scene.add.container(options.x, options.y);
        let content;
        if (options.content === undefined && options.text.text !== undefined) {
            content = this.createLabel(container, options.x, options.y, options);
        } else {
            content = options.content;
        }

        if (options.hasBackground) {
            background = this.createBackground(container, content, options.x, options.y, options.background.width, options.background.height, options);

            content.x = background.rect.centerX - content.displayWidth * 0.5;
            content.y = background.rect.centerY - content.displayHeight * 0.5;
        }

        container.add(content);

        container.x = options.x;
        container.y = options.y;
        console.log(options, container, background);

        this.tooltipCollection[options.id] = { container: container, target: options.target, options: options };
        this.target = options.target;
        return container;

    }

    /**
     *
     *
     * @param {*} id
     * @returns
     * @memberof PhaserTooltip
     */
    getTarget(id) {
        return this.tooltipCollection[id].target;
    }

    /**
     *
     *
     * @param {*} id
     * @returns
     * @memberof PhaserTooltip
     */
    getPadding(id) {
        var paddingTop = this.tooltipCollection[id].options.paddingTop || 12;
        var paddingBottom = this.tooltipCollection[id].options.paddingBottom || 12;
        var paddingLeft = this.tooltipCollection[id].options.paddingLeft || 16;
        var paddingRight = this.tooltipCollection[id].options.paddingRight || 16;
        return { paddingLeft: paddingLeft, paddingRight: paddingRight, paddingTop: paddingTop, paddingBottom: paddingBottom };
    }

    /**
     *
     *
     * @param {*} x
     * @param {*} y
     * @param {*} options
     * @memberof FloatingTextUI
     */
    createLabel(container, x, y, options) {

        let text = this.scene.add.text(x, y, options.text.text, {
            fontFamily: options.text.fontFamily || 'new_rockerregular',
            fontSize: options.text.fontSize || 19,
            color: options.text.textColor || "#ffffff",
            fontStyle: options.text.fontStyle || '',
            align: options.text.align || 'center'
        });

        console.log(options);


        if (options.hasShadow) {
            let shadowColor = options.text.shadowColor || "#1e1e1e";
            let blur = options.text.blur || 1;
            let shadowStroke = options.text.shadowStroke || false;
            let shadowFill = options.text.shadowFill || true;
            text.setShadow(0, 0, shadowColor, blur, shadowStroke, shadowFill);
        }



        //Phaser.Display.Align.In.Center(text, background.rect);


        return text;
    }

    /**
     *
     *
     * @param {*} x
     * @param {*} y
     * @param {*} width
     * @param {*} height
     * @param {*} color
     * @param {*} border
     * @param {*} borderColor
     * @memberof FloatingTextUI
     */
    createBackground(container, content, x, y, width, height, options) {

        var paddingTop = options.paddingTop || 12;
        var paddingBottom = options.paddingBottom || 12;
        var paddingLeft = options.paddingLeft || 16;
        var paddingRight = options.paddingRight || 16;
        let lineStyle = options.background.lineStyle || {
            width: 2,
            color: 0x000000,
            alpha: 0.9
        };
        let fillStyle = options.background.fillStyle || {
            color: 0x000000,
            alpha: 0.9
        };

        var graphics = this.scene.add.graphics({
            lineStyle: lineStyle,
            fillStyle: fillStyle
        });

        let _width = width >= (content.displayWidth + paddingLeft + paddingRight) ? width : content.displayWidth + paddingLeft + paddingRight;
        let _height = height >= (content.displayHeight + paddingTop + paddingBottom) ? height : content.displayHeight + paddingTop + paddingBottom;

        var rect = new Phaser.Geom.Rectangle(0, 0, _width, _height);
        rect.width = _width;
        rect.height = _height;
        graphics.fillRectShape(rect);

        container.add(graphics);

        return { rect: rect, graphic: graphics };
    }

    showLabel() {

    }

}