/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.infestor');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    build: function(spawn, rally) {
        spawn.spawnCreep(
            [CLAIM, MOVE],
            'Infestor' + Math.floor(Math.random() * 100000),
            { memory: { role: 'infestor', rally: rally || 'infest_1', infesting: false } }
        )
    },
    
    run: function(creep) {
        if(creep.memory.rally) {
            var flag = Game.flags[creep.memory.rally];
            
            if(!creep.memory.infesting) {
                if(creep.pos.getRangeTo(flag) > 1) {
                    creep.moveTo(flag);
                } else {
                    creep.memory.infesting = true;   
                }
            } else {
                var controller = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: structure => structure.structureType == 'controller'
                });
                
                if(creep.reserveController(controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(controller);
                }
            }
        }
    }
};