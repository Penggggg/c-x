<template>
    <div v-bind:style="{ position: 'relative'}">
        <slot></slot>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

/**
 * @description 
 * 改变document.title
 */
@Component({ })
export default class C extends Vue {

    @Prop({ type: String, default: '' })
    name!: string;

    mounted( ) {
        try { 
            if ( !!this.name && !!this.name.trim( )) {
                document.title = this.name;
            }
        } catch ( e ) { }
    }
}
</script>