// --- CẤU HÌNH ---
var SHOW_TEXT_AFTER_MS = 18000; // 18 giây sau khi mở web sẽ hiện chữ

var canvas = document.getElementById("cas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var bigbooms = [];

var fireworkSound = new Audio('style/fireworks.mp3');

// --- NHẠC NỀN ---
var backgroundMusic = new Audio('style/nmba.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 1.0;

// --- KHỞI TẠO ---
// Hẹn giờ hiện chữ
setTimeout(function () {
    showNewYearGreetings();
}, SHOW_TEXT_AFTER_MS);

function initAnimate() {
    lastTime = new Date();
    setTimeout(function () {
        startTime = new Date().getTime();
        fadeIn = true;
    }, 3000);
    animate();
}
var lastTime;

// --- LOGIC PHÁO HOA ---
function animate() {
    ctx.save();
    ctx.fillStyle = "rgba(0,5,24,0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    var newTime = new Date();
    if (newTime - lastTime > 1000 + (window.innerHeight - 767) / 2) {
        var random = Math.random() * 100 > 33 ? true : false;
        var x = getRandom(canvas.width / 5, canvas.width * 4 / 5);
        var y = getRandom(50, 200);
        if (random) {
            var bigboom = new Boom(getRandom(canvas.width / 3, canvas.width * 2 / 3), 2, "#FFF", {
                x: x, y: y
            });
            bigbooms.push(bigboom);
        } else {
            var bigboom = new Boom(getRandom(canvas.width / 3, canvas.width * 2 / 3), 2, "#FFF", {
                x: canvas.width / 2, y: 200
            });
            bigbooms.push(bigboom);
        }
        lastTime = newTime;
    }

    for (var i = bigbooms.length - 1; i >= 0; i--) {
        var boom = bigbooms[i];
        if (!boom.dead) {
            boom._move();
            boom._drawLight();
        } else {
            for (var j = boom.booms.length - 1; j >= 0; j--) {
                var frag = boom.booms[j];
                if (!frag.dead) {
                    frag.moveTo();
                } else {
                    boom.booms.splice(j, 1);
                }
            }
            if (boom.booms.length === 0) {
                bigbooms.splice(i, 1);
            }
        }
    }
    requestAnimationFrame(animate);
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

var Boom = function (x, r, c, boomArea) {
    this.booms = [];
    this.x = x;
    this.y = (canvas.height + r);
    this.r = r;
    this.c = c;
    this.boomArea = boomArea;
    this.theta = 0;
    this.dead = false;
    this.ba = parseInt(getRandom(80, 200));
};

Boom.prototype = {
    _paint: function () {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = this.c;
        ctx.fill();
        ctx.restore();
    },
    _move: function () {
        var dx = this.boomArea.x - this.x,
            dy = this.boomArea.y - this.y;
        this.x = this.x + dx * 0.01;
        this.y = this.y + dy * 0.01;
        if (Math.abs(dx) <= this.ba && Math.abs(dy) <= this.ba) {
            this._boom();
            this.dead = true;
        } else {
            this._paint();
        }
    },
    _drawLight: function () {
        ctx.save();
        ctx.fillStyle = "rgba(255,228,150,0.3)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r + 3 * Math.random() + 1, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    },
    _boom: function () {
        fireworkSound.play();
        var fragNum = getRandom(30, 200);
        var fanwei = parseInt(getRandom(300, 400));
        for (var i = 0; i < fragNum; i++) {
            var color = {
                a: parseInt(getRandom(0, 255)),
                b: parseInt(getRandom(0, 255)),
                c: parseInt(getRandom(0, 255))
            };
            var a = getRandom(-Math.PI, Math.PI);
            var x = getRandom(0, fanwei) * Math.cos(a) + this.x;
            var y = getRandom(0, fanwei) * Math.sin(a) + this.y;
            var radius = getRandom(0, 2);
            var frag = new Frag(this.x, this.y, radius, color, x, y);
            this.booms.push(frag);
        }
    }
};

const _0x123e80 = _0x2215;
(function (_0x404ed4, _0x140978) {
    const _0x4f9fa0 = _0x2215,
        _0x2d5f18 = _0x404ed4();
    while (!![]) {
        try {
            const _0x1d1a93 =
                -parseInt(_0x4f9fa0(0x12b)) / 0x1 +
                -parseInt(_0x4f9fa0(0x148)) / 0x2 * (parseInt(_0x4f9fa0(0x155)) / 0x3) +
                -parseInt(_0x4f9fa0(0x130)) / 0x4 +
                -parseInt(_0x4f9fa0(0x149)) / 0x5 +
                -parseInt(_0x4f9fa0(0x152)) / 0x6 * (parseInt(_0x4f9fa0(0x12c)) / 0x7) +
                parseInt(_0x4f9fa0(0x12a)) / 0x8 +
                -parseInt(_0x4f9fa0(0x12d)) / 0x9 * (-parseInt(_0x4f9fa0(0x153)) / 0xa);
            if (_0x1d1a93 === _0x140978) break;
            else _0x2d5f18['push'](_0x2d5f18['shift']());
        } catch (_0x2c5843) {
            _0x2d5f18['push'](_0x2d5f18['shift']());
        }
    }
}(_0x3064, 0xedb03));

var Frag = function (_0x37b7bb, _0x3a6c94, _0x311a22, _0x5ee2f6, _0x48d60f, _0xe902eb) {
    const _0xe8a1d0 = _0x2215;
    this['x'] = _0x37b7bb;
    this['y'] = _0x3a6c94;
    this['r'] = _0x311a22;
    this[_0xe8a1d0(0x13b)] = _0x5ee2f6;
    this['targetX'] = _0x48d60f;
    this['targetY'] = _0xe902eb;
    this[_0xe8a1d0(0x157)] = ![];
};

Frag[_0x123e80(0x159)][_0x123e80(0x13f)] = function () {
    const _0x1d7b1f = _0x123e80;
    this['x'] += (this[_0x1d7b1f(0x144)] - this['x']) * 0.05;
    this['y'] += (this[_0x1d7b1f(0x141)] - this['y']) * 0.05;
    Math[_0x1d7b1f(0x14e)](this[_0x1d7b1f(0x144)] - this['x']) < 0x1 &&
        Math[_0x1d7b1f(0x14e)](this['targetY'] - this['y']) < 0x1 &&
        (this[_0x1d7b1f(0x157)] = !![]);
    ctx[_0x1d7b1f(0x134)]();
    ctx['arc'](this['x'], this['y'], this['r'], 0x0, 0x2 * Math['PI']);
    ctx['fillStyle'] = 'rgb(' + this['color']['a'] + ', ' + this['color']['b'] + ', ' + this['color']['c'] + ')';
    ctx['fill']();
};

initAnimate();

canvas['onclick'] = function (_0x5aa6ef) {
    const _0x3f8f78 = _0x123e80;
    var _0x489080 = _0x5aa6ef[_0x3f8f78(0x158)],
        _0x4afcdd = _0x5aa6ef[_0x3f8f78(0x12e)],
        _0x338229 = new Boom(
            getRandom(canvas[_0x3f8f78(0x12f)] / 0x3, canvas[_0x3f8f78(0x12f)] * 0x2 / 0x3),
            0x2,
            _0x3f8f78(0x14f),
            { 'x': _0x489080, 'y': _0x4afcdd }
        );
    bigbooms[_0x3f8f78(0x14a)](_0x338229);
};

// --- HÀM KHỞI TẠO (KÍCH HOẠT NHẠC) ---
function init() {
    var playPromise = backgroundMusic.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => { })
            .catch(error => {
                document.body.addEventListener('click', function () {
                    backgroundMusic.play();
                }, { once: true });
            });
    }
}
init();

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
addEventListener("resize", resize);

function _0x3064() {
    const _0x3e89de = [
        'hsl(', '1983PelCVc', 'min', 'dead', 'clientX', 'prototype', ', 55%, ',
        '#00000010', '2026', 'textBaseline', 'forEach', 'append', 'Happy',
        'body', 'style', 'background', 'font', '2378120Bdvgah', '560846AoHtIT',
        '7xUdraH', '720oOOyDq', 'clientY', 'width', '2378688CajrPv', 'middle',
        'resize', 'white', 'beginPath', 'px Arial', 'length', 'fill', 'getContext',
        'black', 'fillRect', 'color', 'pow', 'data', 'max', 'moveTo', 'random',
        'targetY', 'fillText', 'overflow', 'targetX', 'ellipse', 'fillStyle', 'sin',
        '3706OSNPuT', '840670oyWEhT', 'push', 'hidden', 'height', 'canvas', 'abs',
        '#FFF', 'Year', 'createElement', '3906294hoLtzk', '484480nPbBRd'
    ];
    _0x3064 = function () { return _0x3e89de; };
    return _0x3064();
}

function _0x2215(_0x2fe50e, _0x599e90) {
    const _0x306403 = _0x3064();
    return _0x2215 = function (_0x2215d3, _0x1c0576) {
        _0x2215d3 = _0x2215d3 - 0x12a;
        let _0x26a6e3 = _0x306403[_0x2215d3];
        return _0x26a6e3;
    }, _0x2215(_0x2fe50e, _0x599e90);
}

// ============================================
// --- TẠO GIAO DIỆN & HIỆU ỨNG CHỮ ---
// ============================================

function showNewYearGreetings() {
    // 1. Tạo lớp nền mờ (Backdrop)
    var backdrop = document.createElement("div");
    Object.assign(backdrop.style, {
        position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0)", transition: "background-color 2s ease",
        zIndex: "9990", pointerEvents: "none"
    });
    document.body.appendChild(backdrop);

    // 2. Tạo khung chứa chữ (Container)
    var container = document.createElement("div");
    container.className = "button-container"; // Sử dụng class như code cũ
    Object.assign(container.style, {
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "90%", maxWidth: "600px", zIndex: "9999", textAlign: "center",
        backgroundColor: "rgba(255, 255, 255, 0.9)", padding: "20px", borderRadius: "15px",
        border: "3px solid #d63031", boxShadow: "0 0 20px rgba(255,0,0,0.5)",
        opacity: "0", transition: "opacity 2s ease"
    });

    // 3. Tạo 4 dòng chữ rỗng
    container.innerHTML = `
        <style>
            .msg-line { 
                font-family: 'Montserrat', sans-serif; 
                font-size: 18px; 
                line-height: 1.6; 
                color: #333; 
                margin-bottom: 15px; 
                font-weight: 600;
                text-align: justify;
            }
            .msg-line:last-child { 
                text-align: center; 
                color: #d63031; 
                font-size: 22px; 
                font-weight: bold; 
                margin-top: 20px;
            }
        </style>
        <p id="line1" class="msg-line"></p>
        <p id="line2" class="msg-line"></p>
        <p id="line3" class="msg-line"></p>
        <p id="line4" class="msg-line"></p>
    `;
    document.body.appendChild(container);

    // 4. Bắt đầu hiệu ứng
    setTimeout(() => {
        backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.6)"; // Tối nền
        container.style.opacity = "1"; // Hiện khung

        // Chạy chuỗi gõ chữ (Waterfall)
        setTimeout(() => {
            typeText('line1', '🎆 Năm mới 2026 đến, chúc bạn và gia đình luôn tràn đầy sức khỏe 💪 và năng lượng tích cực để vững bước trên mọi hành trình.', 50, function () {
                setTimeout(() => {
                    typeText('line2', '😊 Chúc cho niềm vui 🎶, tiếng cười 😂 và hạnh phúc ❤️ sẽ luôn ngập tràn trong mái ấm thân thương của bạn.', 50, function () {
                        setTimeout(() => {
                            typeText('line3', '🌸 Và chúc những ước mơ 🌟, dự định 🎯 trong năm nay đều nở hoa 🌹, mang đến thành công rực rỡ 🏆 và bình an trọn vẹn 🕊️', 50, function () {
                                setTimeout(() => {
                                    typeText('line4', '🎊🎉 Chúc mừng năm mới 🎉🎊', 100);
                                }, 500);
                            });
                        }, 500);
                    });
                }, 500);
            });
        }, 1000);
    }, 100);
}

// Hàm gõ chữ (Đã sửa lỗi hiển thị Emoji)
function typeText(elementId, text, speed, callback) {
    let element = document.getElementById(elementId);
    let i = 0;
    let chars = [...text]; // Dùng spread operator để tách emoji chuẩn
    element.innerHTML = '';
    
    let interval = setInterval(function () {
        element.innerHTML += chars[i];
        i++;
        if (i > chars.length - 1) {
            clearInterval(interval);
            if (callback) callback();
        }
    }, speed);
}