const {genTask} = require('./util/concurrent.js');
const {DAY} = require('./util/time.js');
const timerTasks = require('./timertasks.js');

const E = module.exports;

E.logCleanTask = {
    start: ()=>{
        let {stop} = timerTasks.submit(genTask(function*(){
            



        }), {runEvery: DAY, skipIfRunning: true});
        E.logCleanTask.stop = stop;
    },
    stop: null,
};



