//SCREEN STATUS
let screen = 'start';
//ASSETS
let play; let ez,norm,hard; let quit; let spider; let hero; 
let venom; let powerup; let cave; let music; let death; let item;
//ENTITY ARRAYS
let e = []; let b = []; let p = [];
//GAMEPLAY VARIABLES
let x; let time; let timer; let pauseTimer; let hp; let effect =''; let diff; let int; let bs;
//SCORE VARIABLES
let points; let hs = 0; let hs1 = 0; let hs2 = 0; let hs3 = 0; 

//LOAD ASSETS
function preload() {
    play = loadImage("assets/start.png");
    ez = loadImage("assets/easy.png");
    norm = loadImage("assets/normal.png");
    hard = loadImage("assets/hard.png");
    quit = loadImage("assets/quit.png");
    spider = loadImage("assets/skull.gif");
    hero = loadImage("assets/spider.png");
    venom = loadImage('assets/venom.png');
    powerup = loadImage('assets/powerup.png');
    cave = loadImage("assets/cave2.jpg");
    music = loadSound("assets/music.mp3");
    death = loadSound("assets/death.mp3");
    item = loadSound("assets/item.mp3");
}

//SETS SHAPE MODES AND STARTS MUSIC
function setup() {
    createCanvas(500,500);
    background(0);
    rectMode(CENTER);
    imageMode(CENTER);
}

function draw() {
    //START SCREEN
    if(screen == 'start') {
        tint(255,15);
        image(cave,250,250,500,500);
        noTint();
        image(play,250,250,200,100);
    }

    //DIFFICULTY SELECTION SCREEN
    else if(screen == 'diff') {
        image(cave,250,250,500,500);

        strokeWeight(5); stroke(0,0,0);
        fill(0,200,0); rect(250,160,250,60);
        fill(200,200,0); rect(250,250,250,60);
        fill(200,0,0); rect(250,340,250,60);

        strokeWeight(3); fill(0,0,0);
        textAlign(CENTER,CENTER); textSize(50); 
        text('EASY',250,164);
        text('NORMAL',250,254);
        text('HARD',250,343);
    }
    
    //PAUSE SCREEN
    else if(screen == 'pause') {
        background(0,10); 
        image(quit,250,250,200,100);
    }

    //GAME OVER SCREEN
    else if(screen == 'over') {
        time++;
        background(0,15);
        stroke(0);
        strokeWeight(5);
        textSize(25);
        fill(255,0,0);
        text('GOOD TRY, BUT',150,225);
        text('DO BETTER NEXT TIME',100,250);
        if(time == 200) screen = 'start';
    }

    //GAMEPLAY SCREEN
    else {
        image(cave,250,250,500,500);
        fill(0,0,255);
        stroke(255,255,255);
        strokeWeight(2);
        textAlign(LEFT,CENTER);

        //GAMEPLAY VARIABLE INCREMENTING
        time++; timer++; pauseTimer; points++; 
        if(timer==250) effect = '';

        //DETERMINES ENEMY SPAWN RATES BASED ON DIFFICULTY AND RATE OF DIFFICULTY SCALING
        if(diff==3) {
            if(time%int==0) e[e.length] = new Enemy(random(50,475),-25,random(4,5),100,3,'reg',37.5);
            if(time>750) int = 40; else if(time>500) int = 50; 
            hs = hs3; bs = 6;
        }
        else if(diff==2) {
            if(time%int==0) e[e.length] = new Enemy(random(50,475),-25,random(3,5),100,3,'reg',37.5);
            if(time>2000) int = 50; else if(time>750) int = 60;
            hs = hs2; bs = 8;
        }
        else {
            if(time%int==0)e[e.length] = new Enemy(random(50,475),-25,random(1,4),100,3,'reg',37.5);
            if(time>3000) int = 50; else if(time>1000) int = 60; 
            hs = hs1; bs = 10;
        }

        //SPAWN BOSS ENEMIES AND POWERUPS AT SPECIFIED TIME INTERVALS
        if(time%1500==0) e[e.length] = new Enemy(random(50,475),-25,1,300,10,'boss',60);
        if(time%750==0) p[p.length] = new Powerup();

        //CONTROL PLAYER
        if(mouseX>465) x = 465;
        else if(mouseX<55) x = 55;
        else x = mouseX;

        //DISPLAY ENEMIES AND TEST FOR COLLISIONS
        for(let i = e.length-1; i >= 0; i--) {
            fill(255,0,0); strokeWeight(1);
            line(e[i].x+2,0,e[i].x+2,e[i].y);
            image(spider,e[i].x,e[i].y,e[i].r*2,e[i].r*2);
            e[i].y += e[i].s;
            if(e[i].collide()) { e.splice(i,1); death.play(); }
        }

        //DISPLAY BULLETS AND TEST FOR BULLETS THAT LEAVE THE SCREEN
        for(let j = b.length-1; j >= 0; j--) {
            image(venom,b[j].x,b[j].y,5,10);
            b[j].y -= b[j].s;
            if(b[j].y<=0) b.splice(j,1);
        }

        //DISPLAY POWERUPS AND TEST FOR COLLISIONS
        for(let i = p.length-1; i >= 0; i--) {
            fill(0,255,0);
            image(powerup,p[i].x,p[i].y,50,50);
            p[i].y += 5;
            if(p[i].collide()) {
                if(effect=='HP UP'){
                    if(hp<=275) hp += 25;
                    else if(hp>275) hp = 300;
                }
                timer = 0;
                p.splice(i,1);
            }
        }

        //DISPLAY PLAYER
        line(x,465,x,500);
        image(hero,x,465,75,75);

        //USER INTERFACE DISPLAY
        strokeWeight(2); stroke(0);
        textSize(20);
        fill(0,255,0);
        text('SCORE: ' + points,10,20);
        text('HIGHSCORE: ' + hs,10,45);
        text('SPACE TO PAUSE',10,95);
        fill(random(0,255),random(0,255),random(0,255));
        text('POWER: ' + effect,10,70);
        stroke(0,255,0);
        strokeWeight(5);
        line(15,485,15,475-hp);
        
        //TRIGGERS GAME OVER FUNCTION IF PLAYER HEALTH IS TOO LOW
        if(hp<=0) { 
            gameOver();
        }
    }

}

function mouseClicked() {
    //TESTS IF START BUTTON IS PRESSED AND CHANGES SCREEN STATUS TO DIFFICULTY SELECTION
    if(screen == 'start' && mouseX>150 && mouseX<350 && mouseY>200 && mouseY<300) screen = 'diff';
    //DETERMINES WHAT DIFFICULTY THE USER CHOOSES BASED ON MOUSE POSITION AND STARTS GAME
    else if(screen == 'diff' && mouseX>125 && mouseX<375) {
        if(mouseY>130 && mouseY<190) diff = 1;
        else if(mouseY>220 && mouseY<280) diff = 2;
        else if(mouseY>310 && mouseY<370) diff = 3;
        screen = 'game'; time = 0; int = 75; hp = 300; points = 0;
        music.play();
    }
    //TESTS IF QUIT BUTTON IS PRESSED WHILE ON PAUSE SCREEN AND TRIGGERS GAME OVER
    else if(screen == 'pause' && mouseX>150 && mouseX <350 && mouseY>200 && mouseX<300) {
        gameOver();
    }
    //SPAWNS A BULLET WITH STATS ACCORDING TO POWERUPS
    else {
        if(effect=='QUICK SHOT') b[b.length] = new Bullet(x,450,15,1);
        else if(effect=='ONE SHOT') b[b.length] = new Bullet(x,450,bs,3);
        else b[b.length] = new Bullet(x,450,bs,1);
    }
}

//CHECKS FOR USER INPUT(SPACEBAR) TO PAUSE AND UNPAUSE THE GAME BY CHANGING THE SCREEN VARIABLE
function keyPressed() {
    if(keyCode==32) {
        if(screen == 'game') screen = 'pause';
        else if(screen = 'pause') screen = 'game';
    }

}

//RESETS VARIABLES, SETS HIGHSCORES, AND CLEARS ENTITY ARRAYS WHEN TRIGGERED
function gameOver() {
    e.splice(0,e.length); p.splice(0,p.length); b.splice(0,b.length);
    if(diff==1 && points>hs1) hs1 = points;
    else if(diff==2 && points>hs2) hs2 = points;
    else if(diff==3 && points>hs3) hs3 = points;
    points = 0; screen = 'over'; time = 0; hp = 300; effect = ''; music.pause();
}

class Bullet {
    //CREATES PLAYER PROJECTILE OBJECT WITH ASSIGNED VARIABLES
    constructor(x,y,speed,dmg) {
        this.x = x; this.y = y;
        this.s = speed; this.d = dmg;
    }
}

class Enemy {
    //CREATES AN ENEMY OBJECT WITH THE ASSIGNED VARIABLES
    constructor(x,y,speed,dmg,health,c,radius) {
        this.x = x; this.y = y;
        this.s = speed; this.h = health; this.d = dmg; this.c = c; this.r = radius;
    }

    collide() {
        //TESTS IF ENEMY HITS THE EDGE OF SCREEN AND DOES DAMAGE ACCORDINGLY
        if(this.y >= 475) { 
            hp -= this.d;
            return true; 
        }

        //TESTS IF ENEMY IS HIT BY A BULLET AND/OR DIES; AWARDS POINTS TO PLAYER ACCORDINGLY
        else {
            for(let j = b.length-1; j >= 0; j--) {
                if(dist(b[j].x,b[j].y,this.x,this.y)<=this.r) {
                    this.h -= b[j].d;
                    b.splice(j,1);
                    if(this.h <= 0) {  
                        if(this.c == 'boss') points += 10000;
                        else points += 1000;
                        return true; 
                    }
                } 
            }
        }

        return false;
    }
}

class Powerup {
    //CREATES A POWERUP OBJECT WITH A RANDOMLY ASSIGNED EFFECT; NEW EFFECTS ARE EASY TO ADD
    constructor() {
        this.x = random(50,475); this.y = -25;
        
        let i = random(0,10);
        if(i>6) this.e = 'QUICK SHOT';
        else if(i>2) this.e = 'HP UP';
        else this.e = 'ONE SHOT';
    }

    collide() {
        //CHECKS IF POWERUP LEAVES THE SCREEN
        if(this.y >= 475) return true; 

        //CHECKS IF POWERUP IS HIT BY A BULLET
        else {
            for(let j = b.length-1; j >= 0; j--) {
                if(dist(b[j].x,b[j].y,this.x,this.y)<=25) {
                    effect = this.e;
                    b.splice(j,1);
                    item.play();
                    return true;
                } 
            }
        }
        return false;
    }
}