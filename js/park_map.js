const canvas = document.getElementById("map");
const ctx = canvas.getContext("2d");

var bg_img = new Image();
var ride_images = {};

const legend_items = {
  A: {
    name: "Roller Coaster",
    img: "img/rides/rollerCoaster.jpg",
    type: "Ride",
    color: "#EF4E4E",
    x: 374,
    y: 582,
  },
  B: {
    name: "Top Spin",
    img: "img/rides/topSpin.jpg",
    type: "Ride",
    color: "#EF4E4E",
    x: 547,
    y: 535,
  },
  C: {
    name: "Enterprise",
    img: "img/rides/enterprise.jpg",
    type: "Ride",
    color: "#EF4E4E",
    x: 1066,
    y: 440,
  },
  D: {
    name: "Swing Carousel",
    img: "img/rides/swing.jpg",
    type: "Ride",
    color: "#EF4E4E",
    x: 1325,
    y: 750,
  },
  E: {
    name: "Jungle Adventure",
    img: "img/rides/jungle.jfif",
    type: "Ride",
    color: "#EF4E4E",
    x: 605,
    y: 956,
  },
  F: {
    name: "Castle Playground",
    img: "img/rides/castlePlayground.jpg",
    type: "Attraction",
    color: "#724BB7",
    x: 808,
    y: 701,
  },
  G: {
    name: "Fountain Complex",
    img: "img/rides/fountainComplex.jpg",
    type: "Attraction",
    color: "#724BB7",
    x: 511,
    y: 871,
  },
  H: {
    name: "Ring Toss",
    img: "img/rides/ringToss.jpg",
    type: "Attraction",
    color: "#724BB7",
    x: 706,
    y: 1053,
  },
  I: {
    name: "Balloon Darts",
    img: "img/rides/balloonDarts.jpg",
    type: "Attraction",
    color: "#724BB7",
    x: 1004,
    y: 858,
  },
  J: {
    name: "The Theatre",
    img: "img/rides/theatre.jpg",
    type: "Attraction",
    color: "#724BB7",
    x: 969,
    y: 1079,
  },
  K: {
    name: "Free Space",
    img: "img/rides/navigationFreeSpace.jpeg",
    type: "Attraction",
    color: "#829AB1",
    x: 815,
    y: 363,
  },
  L: {
    name: "Arboretum",
    img: "img/rides/arboretum.jpg",
    type: "Attraction",
    color: "#829AB1",
    x: 560,
    y: 1309,
  },
};

/**
 * By Ken Fyrstenberg Nilsen
 *
 * drawImageProp(context, image [, x, y, width, height [,offsetX, offsetY]])
 *
 * If image and context are only arguments rectangle will equal canvas
 *
 * https://stackoverflow.com/questions/21961839/simulation-background-size-cover-in-canvas/21961894#21961894
 */
function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
  ctx.save();
  if (arguments.length === 2) {
    x = y = 0;
    w = ctx.canvas.width;
    h = ctx.canvas.height;
  }

  // default offset is center
  offsetX = typeof offsetX === "number" ? offsetX : 0.5;
  offsetY = typeof offsetY === "number" ? offsetY : 0.5;

  // keep bounds [0.0, 1.0]
  if (offsetX < 0) offsetX = 0;
  if (offsetY < 0) offsetY = 0;
  if (offsetX > 1) offsetX = 1;
  if (offsetY > 1) offsetY = 1;

  var iw = img.width,
    ih = img.height,
    r = Math.min(w / iw, h / ih),
    nw = iw * r, // new prop. width
    nh = ih * r, // new prop. height
    cx,
    cy,
    cw,
    ch,
    ar = 1;

  // decide which gap to fill
  if (nw < w) ar = w / nw;
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh; // updated
  nw *= ar;
  nh *= ar;

  // calc source rectangle
  cw = iw / (nw / w);
  ch = ih / (nh / h);

  cx = (iw - cw) * offsetX;
  cy = (ih - ch) * offsetY;

  // make sure source rectangle is valid
  if (cx < 0) cx = 0;
  if (cy < 0) cy = 0;
  if (cw > iw) cw = iw;
  if (ch > ih) ch = ih;

  // shadow added by Brett M.
  ctx.shadowColor = "#000000";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // fill image in dest. rectangle
  ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
  ctx.restore();
}

function drawArrow(ctx, x, y) {
  ctx.fillStyle = "#FFFF00";
  ctx.beginPath();
  ctx.moveTo(x, y - 30);
  ctx.lineTo(x - 15, y - 50);
  ctx.lineTo(x + 15, y - 50);
  ctx.fill();
  ctx.rect(x - 8, y - 85, 16, 40);
  ctx.fill();
}

function drawCircle(ctx, x, y, r, letter, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.font = "24px Raleway";
  ctx.fillStyle = "#FFF";
  ctx.fillText(letter, x - r / 2, y + r / 2);
}

let constrain = (floor, value, ceiling) => {
  if (value < floor) return floor;
  else if (value > ceiling) return ceiling;
  else return value;
};

const fillLegend = () => {
  const legend_ul = document.querySelector(".legend > ul");
  Object.entries(legend_items).forEach(([letter, { name, color }]) => {
    let li = document.createElement("li");
    li.innerHTML = `<span class="maplabel" style="background-color:${color}">${letter}</span>${name}`;
    legend_ul.appendChild(li);
  });
};

const preload = () => {
  bg_img.onload = draw;
  bg_img.src = "img/park_map.png";

  Object.entries(legend_items).forEach(([letter, { img }]) => {
    ride_image = new Image();
    ride_image.src = img;
    ride_images[letter] = ride_image;
  });
};

const setup = () => {
  fillLegend();
  document.querySelectorAll(".legend li").forEach((el) => {
    let letter = el.querySelector("span").innerText;
    el.addEventListener("mouseover", () => {
      draw(letter);
    });
    el.addEventListener("mouseout", draw);
  });
};

const draw = (active) => {
  let width = document.querySelector(".map").clientWidth;
  ctx.canvas.width = width;
  let image_size = constrain(500, width, window.innerHeight - 160);
  ctx.canvas.height = image_size;
  let x_offset = 0;
  if (width > image_size) x_offset = (width - image_size) / 2;
  ctx.drawImage(bg_img, x_offset, 0, image_size, image_size);

  Object.entries(legend_items).forEach(([letter, { color, x, y }]) => {
    let _x = (x / 1500) * image_size + x_offset;
    let _y = (y / 1500) * image_size;
    let _w = image_size * 0.4;
    let _h = image_size * 0.27;
    let _r = 15;
    drawCircle(ctx, _x, _y, _r, letter, color);
    if (letter == active) {
      drawArrow(ctx, _x, _y);

      drawImageProp(ctx, ride_images[letter], 0, 0, _w, _h, 0.5, 0.5);
    }
  });
};

window.addEventListener("resize", draw);
document.addEventListener("DOMContentLoaded", () => {
  preload();
  setup();
  draw();
});
