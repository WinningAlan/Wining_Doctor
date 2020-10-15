<template>
    <div>
        <baseChecked v-model="vv"></baseChecked>
    </div>
</template>
<script>
import baseChecked from './baseChecked'
export default {
    components:{
        baseChecked
    },
    data() {
        return {
            vv:'3444'
        }
    },
    watch:{
        vv:function(value) {
            console.log(value)
        }
    }
}
</script>