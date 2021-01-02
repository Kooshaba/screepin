var roleUpgrader = require('role.upgrader');

var harvest = function(creep) {
    var source = creep.pos.findClosestByPath(FIND_SOURCES, { filter: (source) => (source.energy > 0) });
    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
}

var deposit = function(creep, controller) {
    var position = creep.room.name !== controller.room.name ? controller.pos : creep.pos;
    
    var target = position.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_CONTAINER ||
                        structure.structureType == STRUCTURE_SPAWN || (false && structure.structureType == STRUCTURE_TOWER)) && 
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
    });
    if(target) {
        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    } else {
        roleUpgrader.run(creep, controller);
    }
}

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep, controller) {
        if(!creep.memory.state) {
            creep.memory.state = 'moving';
        }
        
	    if(creep.memory.state == 'harvesting' && creep.store.getUsedCapacity() === creep.store.getCapacity()) {
	        creep.memory.state = 'depositing';
	    } else if (creep.memory.state == 'depositing' && creep.store.getUsedCapacity() === 0) {
	        creep.memory.state = 'moving';
	    } else if(creep.memory.state == 'moving' && creep.memory.rally) {
	        var flag = Game.flags[creep.memory.rally];
	        
	        if(creep.pos.getRangeTo(flag) > 1) {
	            creep.moveTo(flag);
	        } else {
	            creep.memory.state = 'harvesting';
	        }
	    } else if(creep.memory.state == 'moving') {
	        creep.memory.state = 'harvesting'
	    }
	    
	    if(creep.memory.state == 'depositing') {
	        deposit(creep, controller);
	    } else if(creep.memory.state == 'harvesting') {
	        harvest(creep);
	    }
	}
};

module.exports = roleHarvester;