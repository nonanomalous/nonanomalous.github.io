var img = new Image();
img.src = "img/park_map.png";

const legend_items = {
  A: {
    name: "The Madhouse",
    x: 1086,
    y: 440,
  },
  B: {
    name: "Racetrack",
    x: 1120,
    y: 742,
  },
  C: {
    name: "Alien Encounter",
    x: 1007,
    y: 860,
  },
  D: {
    name: "The Theatre",
    x: 969,
    y: 1079,
  },
  E: {
    name: "Jungle Adventure",
    x: 605,
    y: 956,
  },
  F: {
    name: "Roller Coaster",
    x: 374,
    y: 582,
  },
};

let constrain = (floor, value, ceiling) => {
  if (value < floor) return floor;
  else if (value > ceiling) return ceiling;
  else return value;
};

const draw = (active) => {
  const canvas = document.getElementById("map");
  const ctx = canvas.getContext("2d");

  let width = document.querySelector(".map").clientWidth;
  ctx.canvas.width = width;

  let image_size = constrain(500, width, window.innerHeight - 160);
  ctx.canvas.height = image_size;
  let x_offset = 0;
  if (width > image_size) offset = (width - image_size) / 2;
  ctx.drawImage(img, x_offset, 0, image_size, image_size);
  Object.entries(legend_items).forEach(([letter, { name, x, y }]) => {
    let _x = (x / 1500) * image_size;
    let _y = (y / 1500) * image_size;
    let _r = 15;
    ctx.beginPath();
    ctx.arc(_x, _y, _r, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#EF4E4E";
    ctx.fill();
    ctx.font = "24px Raleway";
    ctx.fillStyle = "#FFF";
    ctx.fillText(letter, _x - _r / 2, _y + _r / 2);
    if (letter == active) {
      ctx.fillStyle = "#FFFF00";
      ctx.beginPath();
      ctx.moveTo(_x, _y - 30);
      ctx.lineTo(_x - 15, _y - 50);
      ctx.lineTo(_x + 15, _y - 50);
      ctx.fill();
      ctx.rect(_x - 8, _y - 85, 16, 40);
      ctx.fill();
    }
  });
};

window.addEventListener("resize", draw);
document.addEventListener("DOMContentLoaded", draw);

document.querySelectorAll(".legend li").forEach((el) => {
  let letter = el.querySelector("span").innerText;
  el.addEventListener("mouseover", () => {
    draw(letter);
  });
  el.addEventListener("mouseout", draw);
});
