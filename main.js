var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleSoldier = require('role.soldier');

var roleInfestor = require('role.infestor');
var roleDrone = require('role.drone');

var spawnWorker = function(spawn, memory) {
    spawn.spawnCreep([
        WORK, CARRY, MOVE, MOVE], memory.role + 'FreshBoi' + Math.floor(Math.random() * 100000000).toString(), { memory: memory });
}

module.exports.loop = function () {
    var controller = Game.spawns['Spawn1'].room.controller;

    // var tower = Game.getObjectById('c2a31ce453675a2');
    // if(tower) {
    //     var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
    //         filter: (structure) => (structure.hits < structure.hitsMax) && structure.structureType === STRUCTURE_ROAD 
    //     });
        

    //     var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //     if(closestHostile) {
    //         tower.attack(closestHostile);
    //     } else if(closestDamagedStructure) {
    //         tower.repair(closestDamagedStructure);
    //     }
    // }
    
    for(var name in Memory.creeps) {
        if(Game.creeps[name] === undefined) {
            delete Memory.creeps[name];
        }
    }
    
    for(var name in Game.spawns) {
        var spawn = Game.spawns[name];
        var roleList = _.merge(
                {
                    drone: [],
                    upgrader: [],
                    northernUpgrader: [],
                    easternUpgrader: [],
                    builder: [],
                    harvester: [],
                    easternHarvester: [],
                    soldier: [],
                    infestor: []
                    
                },
                _.groupBy(Object.values(Game.creeps), creep => creep.memory.role)
            );
        
        var memory;
        
        if(roleList.infestor.length < 0) {
            roleInfestor.build(spawn, 'infest_1');
        }
        
        if(roleList.drone.length < 0) {
            roleDrone.build(spawn);
        }
        
        if (roleList.easternHarvester.length < 7) {
            memory = { role: 'easternHarvester', rally: 'harvest_1' };
            spawnWorker(spawn, memory);
        } else if(roleList.harvester.length < 2) {
            memory = { role: 'harvester' };
            spawnWorker(spawn, memory);
        } else if(roleList.soldier.length < 6) {
            roleSoldier.build(spawn);
        } else if(roleList.upgrader.length < 1) {
            memory = { role: 'upgrader' };
            spawnWorker(spawn, memory);
        } else if(roleList.northernUpgrader.length < 0) {
            memory = { role: 'northernUpgrader', rally: 'mine_rally_1', traveling: true };
            spawnWorker(spawn, memory);
        } else if(roleList.easternUpgrader.length < 0) {
            memory = { role: 'easternUpgrader', rally: 'mine_rally_2', traveling: true };
            spawnWorker(spawn, memory);
        } else if(roleList.builder.length < 3) {
            memory = { role: 'builder' };
            spawnWorker(spawn, memory);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester' || creep.memory.role == 'easternHarvester') {
            roleHarvester.run(creep, controller);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep, controller);
        }
        if(creep.memory.role == 'northernUpgrader') {
            roleUpgrader.run(creep, controller);
        }
        if(creep.memory.role == 'easternUpgrader') {
            roleUpgrader.run(creep, controller);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'soldier') {
            roleSoldier.run(creep);
        }
        if(creep.memory.role == 'infestor') {
            roleInfestor.run(creep);
        }
        if(creep.memory.role == 'drone') {
            roleDrone.run(creep);
        }
    }
}