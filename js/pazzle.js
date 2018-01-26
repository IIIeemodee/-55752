(function ($) {
    var _defaults = {
        row: 6,
        col: 6,
        onSuccess: function () {
            $('.puzzlify-item').fadeOut(3000);
        },
        destroyAfter: true,
        timeout: 100,
        get MAX() {
            return this.row * this.col;
        },
        colorStart: 'blue',
        colorEnd: 'orange',
        outline: '1px solid rgba(255,255,255, .2)'
    };
    function create(rowMax, colMax, image, w, h) {
        // Size of original image.
        var img = {
            x: w,
            y: h
        };
        // Size of each box.
        var box = {
            x: img.x / colMax,
            y: img.y / rowMax
        };
        // Create class for each box.
        $('<style>', {
            type: 'text/css',
            text: "\n          .puzzlify-wrapper {\n            width: " + img.x + "px;\n            height: " + img.y + "px;\n          }\n          .puzzlify-item {\n            width: " + box.x + "px;\n            height: " + box.y + "px;\n            background-image: url(\"" + image + "\");\n          }\n        "
        }).appendTo('head');
        // Create puzzles!
        for (var col = 0; col < rowMax; col += 1) {
            for (var row = 0; row < colMax; row += 1) {
                $('<div>', { class: 'puzzlify-item' })
                    .css('background-position', -(box.x) * row + "px " + -(box.y) * col + "px")
                    .data('index', $('.puzzlify-item').size())
                    .appendTo('.puzzlify-wrapper');
            }
        }
    }
    function shuffle() {
        var puzzles = $('.puzzlify-item');

        while (puzzles.length) {
            $('.puzzlify-wrapper')
                .append(puzzles.splice(Math.floor(Math.random() * puzzles.length), 1)[0]);
        }
    }
    // jQuery extension
    $.fn.puzzlify = function (options) {
        var _options = Object.assign(_defaults, options);
        // Styling.
        var _styles = "\n        .puzzlify-wrapper {\n          font-size: 0;\n          display: inline-block;\n        }\n        .puzzlify-item {\n          display: inline-block;\n          box-sizing: border-box;\n          outline: " + _options.outline + ";\n        }\n        .puzzlify-item.p1 {\n          box-shadow: inset 0 0 0 3px " + _options.colorStart + ";\n        }\n  \n        .puzzlify-item.p2 {\n          box-shadow: inset 0 0 0 3px " + _options.colorEnd + ";\n        }\n      ";
        $('<style>', {
            type: 'text/css',
            text: _styles
        }).appendTo('head');
        return this.each(function () {
            var that = this;
            var clicks = 0;
            // Wrap image.
            $(this)
                .wrap('<div>').parent()
                .addClass('puzzlify-wrapper');
            create(_options.row, _options.col, this.src, this.clientWidth, this.clientHeight);
            shuffle();

            $('.puzzlify-wrapper').on('click', '.puzzlify-item', function () {
                var _this = this;
                $puzzles = $('.puzzlify-item');
                if (!(clicks++ % 2)) {
                    $(this).addClass('p1');
                }
                else {
                    $(this).addClass('p2');
                    setTimeout(function () {
                        var p1 = $('.p1');
                        var p2 = $(_this);
                        var next = p1.next();
                        var prev = p1.prev();
                        p1.insertAfter(p2);
                        next.length ? p2.insertBefore(next) : p2.insertAfter(prev);
                        $puzzles.removeClass('p1 p2');
                        var right = 0;
                        var puzzles = $puzzles.toArray();
                        puzzles.forEach(function (puzzle) {
                            var $puzzle = $(puzzle);
                            if ($puzzle.index() - 1 === $puzzle.data('index'))
                                right += 1;
                        });
                        if (right === _options.MAX) {
                            _options.onSuccess();
                        }
                    }, _options.timeout);
                }
            });

            $('.puzzlify-wrapper').on('touchstart', '.puzzlify-item', function () {
                var _this = this;
                $puzzles = $('.puzzlify-item');
                if (!(clicks++ % 2)) {
                    $(this).addClass('p1');
                }
                else {
                    $(this).addClass('p2');
                    setTimeout(function () {
                        var p1 = $('.p1');
                        var p2 = $(_this);
                        var next = p1.next();
                        var prev = p1.prev();
                        p1.insertAfter(p2);
                        next.length ? p2.insertBefore(next) : p2.insertAfter(prev);
                        $puzzles.removeClass('p1 p2');
                        var right = 0;
                        var puzzles = $puzzles.toArray();
                        puzzles.forEach(function (puzzle) {
                            var $puzzle = $(puzzle);
                            if ($puzzle.index() - 1 === $puzzle.data('index'))
                                right += 1;
                        });
                        if (right === _options.MAX) {
                            _options.onSuccess();
                        }
                    }, _options.timeout);
                }
            });

            // Hide image
            this.style.display = 'none';
        });

        
    };
})(jQuery);
// Initialize!
$('img').puzzlify({
    row: 2,
    col: 3
});
