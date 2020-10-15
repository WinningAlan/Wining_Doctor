<template>
    <div>
        <input type="text" v-bind:value="value1" v-on:input="changeValue"/>
    </div>
</template>
<script>
export default {
    model:{
        prop:'value1',
        event:'change'
    },
    props:{
        value1:String,
    },
    methods:{
        changeValue(event) {
            this.$emit('change',event.target.value)
        }
    }
}
</script>