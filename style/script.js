var canvas = document.getElementById("cas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var bigbooms = [];
var particles = [];
var stars = [];

var fireworkSound = new Audio('style/fireworks.mp3');
fireworkSound.volume = 0.3;

var backgroundMusic = new Audio('style/nmba.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 1.0;

const colorPalettes = [
    ['#ff0000', '#ffffff', '#0000ff'],
    ['#FFD700', '#FF8C00', '#FFFFFF'],
    ['#ff00ff', '#00ffff', '#ffff00', '#ff0000'],
    ['#3498db', '#2ecc71', '#9b59b6', '#f1c40f'],
    ['#E6E6FA', '#FF69B4', '#DA70D6']
];

var textSequence = ["HAPPY", "NEW", "YEAR", "2026"];
var textIndex = 0;
var programState = 0; 
var stateTimer = 0;
var cardDisplayed = false;

initMusicInteraction();
initStars();
animate();

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    initStars();
}
addEventListener("resize", resize);

function getRandom(min, max) { return Math.random() * (max - min) + min; }

function initMusicInteraction() {
    var playPromise = backgroundMusic.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            document.body.addEventListener('click', function () {
                backgroundMusic.play();
            }, { once: true });
        });
    }
}

function initStars() {
    var numStars = 300;
    for (var i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5,
            alpha: Math.random(),
            twinkleSpeed: getRandom(0.005, 0.02)
        });
    }
}

function drawBackground() {
    ctx.save();
    ctx.fillStyle = "rgba(5, 5, 20, 0.15)"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#FFFFFF";
    stars.forEach(star => {
        star.alpha += star.twinkleSpeed;
        var opacity = Math.abs(Math.sin(star.alpha)) * 0.8 + 0.2;
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.restore();
}

function getHeartPoint(angle) {
    var x = 16 * Math.pow(Math.sin(angle), 3);
    var y = -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));
    return { x: x, y: y };
}

function getStarPoint(angle) {
    var r = 10;
    var R = 22;
    var x = (Math.cos(angle * 5) > 0 ? R : r) * Math.cos(angle);
    var y = (Math.cos(angle * 5) > 0 ? R : r) * Math.sin(angle);
    return { x: x, y: y };
}

function getTextPoints(text) {
    var offCanvas = document.createElement("canvas");
    var offCtx = offCanvas.getContext("2d");
    
    var fontSize = 250; 
    if (text.length > 10) fontSize = 180; 

    offCtx.font = "bold " + fontSize + "px Arial";
    var textWidth = offCtx.measureText(text).width;
    
    offCanvas.width = textWidth + 150;
    offCanvas.height = fontSize * 2.5;
    
    offCtx.font = "bold " + fontSize + "px Arial";
    offCtx.fillStyle = "white";
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    
    offCtx.fillText(text, offCanvas.width / 2, offCanvas.height / 2);
    
    var data = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height).data;
    var points = [];
    var gap = 5; 
    
    for (var y = 0; y < offCanvas.height; y += gap) {
        for (var x = 0; x < offCanvas.width; x += gap) {
            var index = (y * offCanvas.width + x) * 4;
            if (data[index + 3] > 128) {
                points.push({ 
                    x: (x - offCanvas.width / 2), 
                    y: (y - offCanvas.height / 2) 
                });
            }
        }
    }
    return points;
}

var lastTimeRandom = new Date();
var lastTimeText = new Date();

function animate() {
    requestAnimationFrame(animate);
    drawBackground();

    var newTime = new Date();
    
    if (newTime - lastTimeRandom > getRandom(500, 900)) {
        var palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
        var color = palette[Math.floor(Math.random() * palette.length)];
        
        var edge = Math.floor(Math.random() * 4);
        var startX, startY, targetX, targetY;
        var centerXMin = canvas.width * 0.1;
        var centerXMax = canvas.width * 0.9;
        
        switch(edge) {
            case 0: startX = getRandom(0, canvas.width); startY = -20; targetX = getRandom(centerXMin, centerXMax); targetY = getRandom(canvas.height*0.2, canvas.height*0.8); break;
            case 1: startX = canvas.width + 20; startY = getRandom(0, canvas.height); targetX = getRandom(centerXMin, centerXMax); targetY = getRandom(canvas.height*0.2, canvas.height*0.8); break;
            case 2: startX = getRandom(0, canvas.width); startY = canvas.height + 20; targetX = getRandom(centerXMin, centerXMax); targetY = getRandom(canvas.height*0.1, canvas.height*0.6); break;
            case 3: startX = -20; startY = getRandom(0, canvas.height); targetX = getRandom(centerXMin, centerXMax); targetY = getRandom(canvas.height*0.2, canvas.height*0.8); break;
        }

        var shape = 'circle';
        var r = Math.random();
        if(r < 0.15) shape = 'heart';
        else if (r < 0.3) shape = 'star';

        bigbooms.push(new Boom(startX, startY, targetX, targetY, color, palette, shape));
        lastTimeRandom = newTime;
    }

    if (programState === 0) {
        if (newTime - lastTimeText > 2500) {
            if (textIndex < textSequence.length) {
                var textStr = textSequence[textIndex];
                var palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
                var color = palette[Math.floor(Math.random() * palette.length)];
                
                var tStartX = canvas.width / 2;
                var tStartY = canvas.height;
                var tTargetX = canvas.width / 2;
                var tTargetY = canvas.height * 0.4;

                bigbooms.push(new Boom(tStartX, tStartY, tTargetX, tTargetY, color, palette, textStr));
                
                textIndex++;
                lastTimeText = newTime;
            } else {
                programState = 1; 
                stateTimer = newTime;
            }
        }
    } 
    else if (programState === 1) {
        if (newTime - stateTimer > 4000) {
            var textStr = "HAPPY NEW YEAR 2026";
            var palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
            var color = palette[Math.floor(Math.random() * palette.length)];
            
            bigbooms.push(new Boom(canvas.width / 2, canvas.height, canvas.width / 2, canvas.height * 0.35, color, palette, textStr));
            
            programState = 2;
            stateTimer = newTime;
        }
    }
    else if (programState === 2) {
        if (newTime - stateTimer > 4000) {
            if (!cardDisplayed) {
                cardDisplayed = true;
                showPremiumCard();
            }
        }
    }

    for (var i = bigbooms.length - 1; i >= 0; i--) {
        var boom = bigbooms[i];
        if (!boom.dead) {
            boom.update();
            boom.draw();
        } else {
            bigbooms.splice(i, 1);
        }
    }

    for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];
        if (p.alpha > 0.05) {
            p.update();
            p.draw();
        } else {
            particles.splice(i, 1);
        }
    }
}

var Boom = function (startX, startY, targetX, targetY, color, palette, shape) {
    this.x = startX;
    this.y = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.color = color;
    this.palette = palette;
    this.shape = shape;
    this.dead = false;
    this.speed = getRandom(12, 16);
    
    var dx = targetX - startX;
    var dy = targetY - startY;
    this.angle = Math.atan2(dy, dx);
    this.distanceToTarget = Math.sqrt(dx*dx + dy*dy);
    this.distanceTraveled = 0;
};

Boom.prototype = {
    update: function () {
        var vx = Math.cos(this.angle) * this.speed;
        var vy = Math.sin(this.angle) * this.speed;
        
        this.x += vx;
        this.y += vy;
        this.distanceTraveled += this.speed;
        this.speed *= 0.98; 

        if (this.distanceTraveled >= this.distanceToTarget || this.speed < 2) {
            this.dead = true;
            this.explode();
        }
    },
    draw: function () {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    },
    explode: function () {
        var s = fireworkSound.cloneNode(); 
        s.volume = (['circle','heart','star'].includes(this.shape)) ? 0.3 : 0.6; 
        s.play();

        var pColor = this.palette[Math.floor(Math.random() * this.palette.length)];
        
        if (this.shape === 'heart') {
            for (var i = 0; i < Math.PI * 2; i += 0.1) {
                var pt = getHeartPoint(i);
                particles.push(new Particle(this.x, this.y, pColor, pt.x * 0.15, pt.y * 0.15, false));
            }
        } else if (this.shape === 'star') {
             for (var i = 0; i < Math.PI * 2; i += 0.15) {
                var pt = getStarPoint(i);
                particles.push(new Particle(this.x, this.y, pColor, pt.x * 0.25, pt.y * 0.25, false));
            }
        } else if (this.shape !== 'circle') {
            var pts = getTextPoints(this.shape);
            var scale = 1.0; 
            if (this.shape.length > 10) scale = 0.8; 

            pts.forEach(pt => {
                particles.push(new Particle(this.x + pt.x * scale, this.y + pt.y * scale, pColor, 0, 0, true));
            });
        } else {
            var count = getRandom(60, 120);
            for (var i = 0; i < count; i++) {
                var angle = getRandom(0, Math.PI * 2);
                var speed = getRandom(1, 15); 
                particles.push(new Particle(this.x, this.y, pColor, Math.cos(angle) * speed, Math.sin(angle) * speed, false));
            }
        }
    }
};

var Particle = function (x, y, color, vx, vy, isText) {
    this.x = x;
    this.y = y;
    this.lastX = x;
    this.lastY = y;
    this.color = color;
    this.isText = isText;
    
    if (isText) {
        this.vx = (Math.random() - 0.5) * 0.5; 
        this.vy = (Math.random() - 0.5) * 0.5;
        this.gravity = 0.02; 
        this.friction = 0.96; 
        this.radius = getRandom(1.5, 2.5); 
        this.decay = 0.006; 
    } else {
        this.vx = vx;
        this.vy = vy;
        this.gravity = 0.08;
        this.friction = 0.95;
        this.radius = getRandom(1.5, 3);
        this.decay = getRandom(0.015, 0.03);
    }
    this.alpha = 1;
};

Particle.prototype = {
    update: function () {
        this.lastX = this.x;
        this.lastY = this.y;
        
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        
        this.x += this.vx;
        this.y += this.vy;
        
        this.alpha -= this.decay;
        
        if (this.isText) {
             if(Math.random() > 0.92) this.alpha = 1;
        }
    },
    draw: function () {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.moveTo(this.lastX, this.lastY);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.radius;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();
    }
};

function showPremiumCard() {
    var backdrop = document.createElement("div");
    Object.assign(backdrop.style, {
        position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0)", transition: "background-color 2.5s ease",
        zIndex: "9990", pointerEvents: "none"
    });
    document.body.appendChild(backdrop);

    var container = document.createElement("div");
    container.className = "premium-card";
    
    container.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Montserrat:wght@400;500;700&family=Playfair+Display:wght@700&display=swap');
            
            .premium-card {
                position: fixed; top: 50%; left: 50%;
                transform: translate(-50%, -50%) perspective(1000px) rotateX(90deg) scale(0.5);
                width: 90%; max-width: 650px; z-index: 9999;
                text-align: center; padding: 50px 40px; border-radius: 15px;
                background: linear-gradient(145deg, #740001, #300000);
                border: 2px solid #D4AF37;
                box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.2) inset;
                opacity: 0;
                transition: all 2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                color: #FFF8E7; overflow: hidden;
            }
            
            .premium-card::before {
                content: ''; position: absolute; top: 5px; left: 5px; right: 5px; bottom: 5px;
                border: 1px dashed rgba(212, 175, 55, 0.5); border-radius: 10px; pointer-events: none;
            }

            .card-visible { opacity: 1; transform: translate(-50%, -50%) perspective(1000px) rotateX(0deg) scale(1); }
            .card-floating { animation: floatCard 6s ease-in-out infinite; }
            @keyframes floatCard { 0%, 100% { transform: translate(-50%, -50%); } 50% { transform: translate(-50%, -52%); } }
            
            .card-title {
                font-family: 'Dancing Script', cursive;
                background: linear-gradient(to right, #D4AF37, #FFDF00, #D4AF37);
                -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                font-size: 3rem; margin-bottom: 25px; 
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));
            }
            
            .msg-line {
                font-family: 'Montserrat', sans-serif; font-size: 16px; line-height: 1.6;
                color: #FFF8E7; margin-bottom: 12px; text-align: justify;
                opacity: 0; transform: translateY(20px); transition: opacity 1s ease, transform 1s ease;
            }
            .msg-visible { opacity: 1; transform: translateY(0); }
            .highlight-gold { color: #FFD700; font-weight: 700; }
            
            .final-line {
                font-family: 'Playfair Display', serif; font-size: 24px;
                color: #D4AF37; margin-top: 30px; opacity: 0; transform: scale(0.8);
                transition: all 1s cubic-bezier(0.34, 1.56, 0.64, 1);
                text-transform: uppercase; letter-spacing: 2px;
                border-top: 1px solid rgba(212, 175, 55, 0.3); border-bottom: 1px solid rgba(212, 175, 55, 0.3);
                padding: 10px 0;
            }
            .final-visible { opacity: 1; transform: scale(1); }
        </style>
        
        <div class="card-title">Happy New Year Thu Thảo!</div>
        <div id="line1" class="msg-line">
            ✨ Năm mới 2026 rồi, chúc <span class="highlight-gold">Thu Thảo</span> một năm thật nhiều niềm vui, sức khỏe và mọi thứ đều thuận lợi hơn năm cũ. Mong là những điều cậu đang cố gắng sẽ dần thành hiện thực, còn những điều chưa kịp bắt đầu thì… biết đâu sẽ nở rộ trong năm nay.
        </div>
        <div id="line2" class="msg-line">
            🌟 Hy vọng năm mới mang đến cho cậu thật nhiều may mắn, những cơ hội tốt và cả những ngày bình yên để tận hưởng cuộc sống theo cách cậu muốn. 
        </div>
        <div id="line3" class="msg-line">
            💌 Cảm ơn vì đã luôn là một người bạn rất đặc biệt — người mà mình có thể chia sẻ bất cứ lúc nào, kể cả những chuyện nhỏ nhặt nhất. Chúc cậu một năm bình an và đầy năng lượng tích cực!
        </div>
        <div id="line4" class="final-line">Chúc Mừng Năm Mới 2026</div>
    `;
    document.body.appendChild(container);

    setTimeout(() => {
        backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.85)"; 
        container.classList.add('card-visible');
        setTimeout(() => { container.classList.add('card-floating'); }, 2200);
        
        var delay = 1200;
        setTimeout(() => { document.getElementById('line1').classList.add('msg-visible'); }, 500);
        setTimeout(() => { document.getElementById('line2').classList.add('msg-visible'); }, 500 + delay);
        setTimeout(() => { document.getElementById('line3').classList.add('msg-visible'); }, 500 + delay * 2);
        setTimeout(() => { document.getElementById('line4').classList.add('final-visible'); }, 500 + delay * 3 + 500);
    }, 100);
}




