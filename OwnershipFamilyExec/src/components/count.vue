<template>
    <div>
        <h2>{{msg}}</h2>
        <hr/>
        <h3>{{$store.state.count}}</h3>
        <p>----操作属性的状态---</p>
        <button @click="add">+</button>
        <button @click="reduce">-</button>
        <p>-----</p>
        <p>
          <button @click="addAction">+</button>
          <button @click="reduceAction">-</button>
        </p>
         <!-- <button @click="$store.commit('add')">+</button>
         <button @click="$store.commit('reduce')">-</button> -->
    </div>
</template>
<script>
import store from '../store/index';
// import {mapState} from 'vuex';
import { mapState,mapMutations,mapGetters,mapActions } from 'vuex';
export default{
    data(){
        return{
            msg:'Hello Vuex'
        }
    },
    computed: {
      
    },
    // store,
    // computed:mapState({
    //         count:state=>state.count  //理解为传入state对象，修改state.count属性
    // }),
    methods:{
      ...mapMutations([  
            'add','reduce'
        ]),
        ...mapActions(['addAction','reduceAction'])
    }
    // computed:{
    //     count(){
    //         return this.$store.state.count;
    //     }
    // }
}
</script>