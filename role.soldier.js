/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.soldier');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    build: function(spawn) {
        spawn.spawnCreep([ATTACK, MOVE, ATTACK, MOVE], 'Soldier' + Math.floor(Math.random() * 1000000), { memory: { rally: 'attack_1', role: 'soldier' } });
    },
    run: function(creep) {
        var flag = Game.flags[creep.memory.rally];
        var enemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        
        if(enemy) {
            if(creep.attack(enemy) === ERR_NOT_IN_RANGE) {
                creep.moveTo(enemy);
            }
        } else {
            if(creep.pos.getRangeTo(flag) > 1) {
                creep.moveTo(flag);    
            }
        }
    }
};