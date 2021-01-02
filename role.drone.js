var roleUpgrader = require('role.upgrader');

module.exports = {
    build: function(spawn, size) {
        spawn.spawnCreep(
            [WORK, WORK, CARRY, MOVE, MOVE, MOVE],
            'Drone' + Math.floor(Math.random() * 10000),
            { memory: { role: 'drone', rally: 'work_1', traveling: true } }
        )
    },
    
    run: function(creep) {
        if(creep.memory.rally) {
            var flag = Game.flags['work_1'];
            
            if(creep.memory.traveling) {
                if(creep.pos.getRangeTo(flag) > 1) {
                    creep.moveTo(flag);
                } else {
                    creep.memory.traveling = false;
                }
            } else {
                roleUpgrader.run(creep, creep.room.controller);
            }
        }
    }
};