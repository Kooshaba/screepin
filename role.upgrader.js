var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep, controller) {

        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.memory.traveling = true;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller, {visualizePathStyle: {stroke: '#F9F9F9'}});
            }
        }
        else {
            if(creep.memory.traveling && creep.memory.rally && creep.pos.getRangeTo(Game.flags[creep.memory.rally]) > 2) {
                var flag = Game.flags[creep.memory.rally];
                creep.moveTo(flag);
            } else {
                creep.memory.traveling = false;
                var source = creep.pos.findClosestByPath(FIND_SOURCES);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }   
            }
        }
	}
};

module.exports = roleUpgrader;