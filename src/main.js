(function (win, $) {
    var winW = $(window).width();
    var winH = $(window).height();
    var score = 0;
    var wheel = 0;
    var digger = 0;
    var lglogo = 0;
    var gooddriver = 0;
    var QingLvGroup;
    var hitNum = 0;
    var sound = '';
    //挖掘机
    var config = {
        num: 1,
        selfPool: 30,
        selfPic: 'digger',
        rate: 1.7,
        maxSpeed: 1100,
        minSpeed: 1000,
        max: 95,
        point: 1
    }
    //装载机
    var config1 = {
        num: 2,
        selfPool: 300,
        selfPic: 'wheel',
        rate: 1,
        maxSpeed: 960,
        minSpeed: 810,
        max: 95,
        point: 2
    }
    //好司机
    var config2 = {
        num: 3,
        selfPool: 30,
        selfPic: 'gooddriver',
        rate: 5.5,
        maxSpeed: 2600,
        minSpeed: 2350,
        max: 95,
        point: 3
    }
    //临工
    var config3 = {
        num: 4,
        selfPool: 30,
        selfPic: 'lglogo',
        rate: 8.5,
        maxSpeed: 1960,
        minSpeed: 1130,
        max: 95,
        point: 3
    }
    var dogConfig = {
        selfPool: 20,
        selfPic: 'gold',
        rate: 0.3,
        maxSpeed: 300,
        minSpeed: 100,
        punished: true
    }
    var time = 40;

    var radio = winW / 375;

    function rfuc(n) {
        return n * radio;
    }

    /***********************/
    function QingLv(config) {
        this.init = function () {
            this.config = config;
            QingLvGroup = game.add.group();
            QingLvGroup.enableBody = true;
            QingLvGroup.createMultiple(config.selfPool, config.selfPic);
            QingLvGroup.setAll('anchor.y', 1)
            QingLvGroup.setAll('outOfBoundsKill', true);
            QingLvGroup.setAll('checkWorldBounds', true);
            this.maxWidth = game.width - 100;
            sound = game.add.audio('sound');
            //0.5秒掉一个
            game.time.events.loop(Phaser.Timer.SECOND * config.rate, this.createQL, this);
        };
        this.createQL = function () {
            var e = QingLvGroup.getFirstExists(false);

            if (e) {
                if (hitNum >= config.max) {
                    return;
                }
                hitNum++;
                e.events.onInputDown.removeAll();
                var ram = Math.random();
                ram = ram < 0.5 ? ram += 0.5 : ram;
                e.loadTexture(this.config.selfPic)
                e.alpha = 1;
                e.scale.setTo(rfuc(ram));
                e.reset(game.rnd.integerInRange(0, this.maxWidth), 0)
                e.body.velocity.y = game.rnd.integerInRange(config.minSpeed, config.maxSpeed);
                //config
                e.config = config;
                e.inputEnabled = true;
                e.events.onInputDown.add(this.hitted, this)
            }
        };
        this.hitted = function (sprite) {
            score += sprite.config.point;
            //audio1.play();
            sound.play();
            switch (sprite.config.num) {
                case 1:
                    digger++;
                    break;
                case 2:
                    wheel++;
                    break;
                case 3:
                    gooddriver++;
                    break;
                default:
                    lglogo++;
            }
            sprite.inputEnabled = false;
            var anim = sprite.animations.add('hitted');
            sprite.play('hitted', 100, false);
            anim.onComplete.add(this.fade, this, sprite)    
        };
        this.fade = function (sprite) {
            var tween = game.add.tween(sprite).to({
                alpha: 0
            }, 300, 'Linear', true)
            tween.onComplete.add(this.killed, this, sprite);
        };
        this.killed = function (sprite) {
            sprite.kill();
        }
    }

    function Dog(config) {
        this.init = function () {
            this.config = config;
            this.DogGroup = game.add.group();
            this.DogGroup.enableBody = true;
            this.DogGroup.createMultiple(config.selfPool, config.selfPic);
            this.DogGroup.setAll('anchor.y', 1)
            this.DogGroup.setAll('outOfBoundsKill', true);
            this.DogGroup.setAll('checkWorldBounds', true);
            this.maxWidth = game.width - 80;

            game.time.events.loop(Phaser.Timer.SECOND * config.rate, this.createDog, this);

        };
        this.createDog = function () {
            var e = this.DogGroup.getFirstExists(false);

            if (e) {
                var ram = Math.random();
                ram = ram < 0.5 ? ram += 0.5 : ram;
                e.loadTexture(this.config.selfPic)
                e.alpha = 1;
                e.scale.setTo(ram);
                e.reset(game.rnd.integerInRange(0, this.maxWidth), 0)
                e.body.velocity.y = game.rnd.integerInRange(config.minSpeed, config.maxSpeed);
            }
        };
    }

    /***********************/

    var game = new Phaser.Game(winW, winH, Phaser.AUTO, '');

    game.States = {};

    game.States.boot = function () {
        this.preload = function () {
            if (typeof (GAME) !== "undefined") {
                this.load.baseURL = GAME + "/";
            }
            if (!game.device.desktop) {
                this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
                this.scale.forcePortrait = true;
                this.scale.refresh();
            }
        };
        this.create = function () {
            game.stage.backgroundColor = '#F6DE8C';
            game.state.start('preload');
        };
    };

    game.States.preload = function () {
        this.preload = function () {
            game.load.spritesheet('daojishi', 'assets/img/daojishi.png', 200, 200, 3);
            game.load.image('bg', 'assets/img/bg.jpg');
            game.load.spritesheet('digger', 'assets/img/digger.png',200,150,2);
            game.load.spritesheet('wheel', 'assets/img/wheel.png',200,150,2);
            game.load.spritesheet('gooddriver', 'assets/img/gooddriver.png',200,150,2);
            game.load.spritesheet('lglogo', 'assets/img/lglogo.png',157,150,2);
            game.load.image('gold', 'assets/img/gold.png');
            game.load.audio('sound', './mp3/a1.mp3');
            // game.load.image('logo', 'assets/img/logo.png');
            // game.load.image('shengyu', 'assets/img/shengyu.png');
            // game.load.image('chaisan', '');
            game.load.bitmapFont('number', 'assets/img/number.png', 'assets/img/number.xml');
        };
        this.create = function () {
            game.state.start('main');
        };
    };

    game.States.main = function () {
        this.create = function () {
            // 剩余时间
            this.leftTime = time;

            // 物理系统
            game.physics.startSystem(Phaser.Physics.ARCADE);

            // 背景图
            var bg = game.add.sprite(0, 0, 'bg');
            bg.width = game.width;
            bg.height = game.height;

            // logo
            // var logo = game.add.sprite(game.world.centerX - game.cache.getImage('logo').width / 2 * 0.6, 0, 'logo')
            // logo.scale.setTo(0.6)

            // 开始游戏倒计时
            var daojishi = game.add.sprite(game.world.centerX - 100, game.world.centerY - 100, 'daojishi');
            var anim = daojishi.animations.add('daojishi');
            daojishi.play('daojishi', 1, false);
            anim.onComplete.add(this.startGame, this, daojishi);

            // 游戏结束倒计时
            // var shengyu = game.add.sprite(0, 0, 'shengyu');
            // shengyu.fixedToCamera = true;
            // shengyu.scale.setTo(rfuc(0.75))
            // shengyu.cameraOffset.setTo(game.camera.width - rfuc(150), game.camera.height - rfuc(85));
            // 已拆散
            // var chaisan = game.add.sprite(0, 0, 'chaisan');
            // chaisan.fixedToCamera = true;
            // chaisan.scale.setTo(rfuc(0.75))
            // chaisan.cameraOffset.setTo(game.camera.width - rfuc(
            //     150), game.camera.height - rfuc(60));
            // 剩余时间
            this.leftTimeText = game.add.bitmapText(0, 0, 'number', '00:' + this.leftTime, 26);
            this.leftTimeText.scale.setTo(rfuc(1))
            this.leftTimeText.fixedToCamera = true;
            this.leftTimeText.cameraOffset.setTo(game.camera.width - rfuc(80), game.camera.height - rfuc(88));
            // 点中数
            this.chaiisanNum = game.add.bitmapText(0, 0, 'number', score.toString(), 26);
            this.chaiisanNum.scale.setTo(rfuc(1))
            this.chaiisanNum.fixedToCamera = true;
            this.chaiisanNum.cameraOffset.setTo(game.camera.width - rfuc(80), game.camera.height - rfuc(64));

        };
        this.update = function () {
            this.chaiisanNum.text = score;
        }
        this.startGame = function (daojishi) {
            daojishi.visible = false;
            this.createQingLv();
            game.time.events.repeat(Phaser.Timer.SECOND, this.leftTime, this.refreshTime, this)
        };
        this.createQingLv = function () {
            //挖掘机
            this.qinglv = new QingLv(config);
            this.qinglv.init();
            //装载机
            this.qinglv = new QingLv(config1);
            this.qinglv.init();
            //好司机
            this.qinglv = new QingLv(config2);
            this.qinglv.init();
            //临工
            this.qinglv = new QingLv(config3);
            this.qinglv.init();
            // this.dog = new Dog(dogConfig);
            // this.dog.init();
        };
        this.refreshTime = function () {
            this.leftTime--;
            var tem = this.leftTime;
            if (this.leftTime < 10) {
                tem = '0' + this.leftTime;
            }
            this.leftTimeText.text = '00:' + tem;
            //结束后操作
            if (this.leftTime === 0) {
                game.paused = true;
                console.log("结束······")
                // var b = new Base64(); 
                // var str = b.encode(score.toString());
                // localStorage.bbbb=str;
                var data_hsj = {
                    "amount": score,
                    "digger": digger,
                    "gooddriver": gooddriver,
                    "id": "",
                    "lglogo": lglogo,
                    "name": "",
                    "tel": window.localStorage.getItem("telphone"),
                    "time": "",
                    "wheel": wheel
                }
              
                $.ajax({
                    type: "POST",
                    url: "http://haosiji.sdlg.cn:8090/goodDriver/1.0/driverGameInfo",
                    data: JSON.stringify(data_hsj),
                    contentType: 'application/json; charset=UTF-8',
                    dataType: "json",
                    success: function (data) {
                        if (data.code == "200") {
                            window.localStorage.setItem("sum", score * 5);
                            window.location.href = './result.html';
                        } else {
                            alert("服务维护中···")
                            window.location.href = './index.html';
                        }
                    },
                    error: function () {
                        alert("服务维护中···")
                        window.location.href = './index.html';
                    }
                });
                game.state.start('over');
            }
        }
    };


    game.States.over = function () {
        this.create = function () {
            console.log("结束的方法")
        };
    }

    game.state.add('boot', game.States.boot);
    game.state.add('preload', game.States.preload);
    game.state.add('main', game.States.main);
    game.state.add('over', game.States.over);

    game.state.start('boot');

})(window, jQuery);