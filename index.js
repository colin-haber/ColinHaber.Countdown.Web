Date.prototype.toISODurationString = function () {
	return "P" + this.getDurationDays() + "D" + this.getDurationHours() + "H" + this.getDurationMinutes() + "M" + this.getDurationSeconds() + "S";
}
Date.prototype.getDurationDays = function () {
	return Math.floor(this.getTime() / (1000 * 60 * 60 * 24));
}
Date.prototype.getDurationHours = function () {
	return Math.floor((this.getTime() % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
}
Date.prototype.getDurationMinutes = function () {
	return Math.floor((this.getTime() % (1000 * 60 * 60)) / (1000 * 60));
}
Date.prototype.getDurationSeconds = function () {
	return Math.floor((this.getTime() % (1000 * 60)) / 1000);
}
document.addEventListener("DOMContentLoaded", function (evt) {
	document.querySelectorAll(".editor-add").forEach(el => el.addEventListener("click", function (evt) {
		let editor = this.parentElement.parentElement;
		let name = editor.querySelector(".editor-name").value;
		let time = new Date(editor.querySelector(".editor-end").value);
		createCountdown(name, time);
		saveData();
	}));
	loadData();
	updateClocks();
});
function createCountdown(name, time) {
	let template = document.querySelector("#clock-template");
	let fragment = template.content.cloneNode(true);
	fragment.querySelector(".clock-name").textContent = name;
	let end = fragment.querySelector(".clock-end");
	end.setAttribute("datetime", time.toISOString());
	end.textContent = time.toLocaleString();
	let node = document.importNode(fragment, true);
	let root = node.querySelector(".clock-root");
	node.querySelector(".clock-delete").addEventListener("click", function (evt) {
		root.remove();
		saveData();
	});
	let container = document.querySelector(".clock-container");
	container.insertBefore(node, container.lastElementChild);
}
function updateClocks() {
	document.querySelectorAll(".clock-container .clock-root").forEach(el => {
		let countdown = el.querySelector(".clock-countdown");
		let end = el.querySelector(".clock-end");
		let time = new Date(end.getAttribute("datetime"));
		let remaining = new Date(time - Date.now());
		countdown.setAttribute("datetime", remaining.toISODurationString());
		countdown.querySelector(".clock-day").textContent = remaining.getDurationDays();
		countdown.querySelector(".clock-hour").textContent = remaining.getDurationHours().toString().padStart(2, "0");
		countdown.querySelector(".clock-minute").textContent = remaining.getDurationMinutes().toString().padStart(2, "0");
		countdown.querySelector(".clock-second").textContent = remaining.getDurationSeconds().toString().padStart(2, "0");
	});
	requestAnimationFrame(updateClocks);
}
function saveData() {
	let clocks = [];
	document.querySelectorAll(".clock-container .clock-root").forEach(el => {
		clocks.push({
			name: el.querySelector(".clock-name").textContent,
			time: el.querySelector(".clock-end").getAttribute("datetime")
		});
	});
	window.localStorage.setItem("clocks", JSON.stringify(clocks));
}
function loadData() {
	if (!window.localStorage.getItem("clocks")) {
		let now = new Date(Date.now());
		now.setFullYear(now.getFullYear() + 1);
		createCountdown("The Future", now);
	} else {
		let clocks = JSON.parse(window.localStorage.getItem("clocks"));
		for (var i = 0; i < clocks.length; i++) {
			let clock = clocks[i];
			createCountdown(clock.name, new Date(clock.time));
		}
	}
}
