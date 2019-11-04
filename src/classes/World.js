import config from "../conf.json";
import Utils from "./Utils";
import Cell from "./Cell";
import Obstacle from "./Obstacle";
import Gate from "./Gate.js";
import Accessory from "./Accessory.js";
import Player from "./Player.js";

export default class World {
	constructor(univers) {
		this.univers = univers;
		/* this.nbWeapon = this.players.length;
		this.nbObject = this.players.length; */
		this.worldSizeY = config.nbCasesY;
		this.worldSizeX = config.nbCasesX;
		this.grid = [];
	}
	reGenerateWorld(existingGrid) {
		console.log("reGenerateWorld");
		for (let x = 0; x < existingGrid.length; x++) {
			let line = [];
			for (let y = 0; y < existingGrid[x]; y++) {
				const existingCell = existingGrid[x][y];
				let objects = [];
				for (let index = 0; index < existingCell.objects.length; index++) {
					const existingObject = existingCell.objects[index];

					switch (existingObject.type) {
						case "Accessory":
							objects.push(new Accessory());
							break;
						case "Weapon":
							new Weapon();
							break;
						case "Player":
							console.log("object", object);
							new Player(object.playerName, object.heroNum, object.playerNum, object.accessories);
							break;
						case "Obstacle":
							new Obstacle(this.univers);
							break;
						case "Gate":
							new Gate();
							break;
					}
				}

				console.log("existingCell", existingCell);
				line.push(new Cell(x, y, objects));
			}
			this.grid.push(line);
		}
	}
	generateWorld(players, weapons, accessories) {
		for (let x = 0; x < this.worldSizeX; x++) {
			let line = [];
			for (let y = 0; y < this.worldSizeY; y++) {
				line.push(new Cell(x, y, []));
			}
			this.grid.push(line);
		}
		if (this.univers === "4" || this.univers === "5" || this.univers === "6") {
			this.placePorte();
		}
		this.placeObstacles();
		this.placePlayers(players);
		this.placeAccessories("weapon", weapons);
		this.placeAccessories("accessory", accessories);

		return this.grid;
	}
	placePorte() {
		let x = Math.floor(Math.random() * Math.floor(this.worldSizeX));
		let y = Math.floor(Math.random() * Math.floor(this.worldSizeY));
		if (Utils.isFreeCell(x, y, this.grid)) {
			let newGate = new Gate(this.univers);
			let newCell = new Cell(x, y, [newGate]);
			Utils.updateCell(x, y, newCell, this.grid);
		} else {
			this.placePorte();
		}
	}
	placeObstacles() {
		let nbObstacle = config.nbObstacles;
		if (this.univers === "6") nbObstacle = config.nbObstaclesQuete6;
		for (let i = 0; i < nbObstacle; i++) {
			this.placeOneObstacle();
		}
	}
	placeOneObstacle() {
		let x = Math.floor(Math.random() * Math.floor(this.worldSizeX));
		let y = Math.floor(Math.random() * Math.floor(this.worldSizeY));
		if (Utils.isFreeCell(x, y, this.grid)) {
			let newObstacle = new Obstacle(this.univers);
			let newCell = new Cell(x, y, [newObstacle]);
			Utils.updateCell(x, y, newCell, this.grid);
		} else {
			this.placeOneObstacle();
		}
	}
	placePlayers(players) {
		for (let i = 0; i < players.length; i++) {
			const player = players[i];
			this.placeOnePlayer(player);
		}
	}
	placeOnePlayer(player) {
		let x = Math.floor(Math.random() * Math.floor(this.worldSizeX));
		let y = Math.floor(Math.random() * Math.floor(this.worldSizeY));
		if (Utils.isFreePlayerCell(x, y, this.grid)) {
			player.placeX = x;
			player.placeY = y;
			let newCell = new Cell(x, y, [player]);
			Utils.updateCell(x, y, newCell, this.grid);
		} else {
			this.placeOnePlayer(player);
		}
	}

	placeAccessories(objectToPlace, tabObjects) {
		for (let i = 0; i < tabObjects.length; i++) {
			const object = tabObjects[i];
			this.placeOneAccessory(objectToPlace, object);
		}
	}
	placeOneAccessory(objectToPlace, object) {
		let x = Math.floor(Math.random() * Math.floor(this.worldSizeX));
		let y = Math.floor(Math.random() * Math.floor(this.worldSizeY));
		if (Utils.isFreeCell(x, y, this.grid)) {
			let newCell = new Cell(x, y, [object]);
			Utils.updateCell(x, y, newCell, this.grid);
		} else {
			this.placeOneAccessory(objectToPlace, object);
		}
	}
}
