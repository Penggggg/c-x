import { observable, action } from 'mobx';

/** 一个VM的mobx store */
class VM {

    @observable age = 11;

    @action.bound setAge( age: number ) {
        this.age = age;
    }

}

export default new VM( );
