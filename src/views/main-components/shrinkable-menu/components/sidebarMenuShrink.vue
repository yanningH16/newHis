<template>
    <div>
        <template v-for="(item, index) in menuList">
            <div style="text-align: center;height:35px" :key="index" @on-click="changeMenu">
                <Dropdown transfer v-if="item.children.length > 0" placement="right-start" :key="index">
                    <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <Icon :size="20" :color="iconColor" :type="item.children[0].icon || item.icon"></Icon>
                    </Button>
                    <DropdownMenu style="width: 200px;" slot="list">
                        <template v-for="(child, i) in item.children">
                            <Collapse v-if="child.children.length > 0" v-model="value1" :key="i">
                                <Panel :name="child.children[0].name" :key="'d' + index">
                                    {{ item.title }}
                                    <div slot="content" v-for="(childson,i2) in child.children" :key="i2">
                                        <DropdownMenu style="margin-left:14px" slot="list">
                                            <DropdownItem :name="childson.name" :key="i2">
                                                <span @click="changeMenu(childson.name,childson)">{{ itemTitle(childson) }}</span>
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </div>
                                </Panel>
                            </Collapse>
                            <Collapse v-else v-model="value1" :key="i" id="noChild">
                                <Panel :name="child.name" :key="'d' + index" >
                                    <span  @click="changeMenu(child.name,child)">{{ itemTitle(child) }}</span>
                                </Panel>
                            </Collapse>

                        </template>
                    </DropdownMenu>
                </Dropdown>
<!--                <Dropdown v-else transfer placement="right-start" :key="index">-->
<!--                    <Button @click="changeMenu(item.children[0].name,item.children[0])" style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">-->
<!--                        <Icon :size="20" :color="iconColor" :type="item.icon"></Icon>-->
<!--                    </Button>-->
<!--                    <DropdownMenu style="width: 200px;" slot="list">-->
<!--                        <DropdownItem :name="item.children[0].name" :key="'d' + index"><Icon :type="icon"></Icon><span style="padding-left:10px;">{{ itemTitle(item.children[0]) }}</span></DropdownItem>-->
<!--                    </DropdownMenu>-->
<!--                </Dropdown>-->
            </div>
        </template>
    </div>
</template>

<script>
export default {
    data(){
       return {
            value1:'',
            name: 'sidebarMenuShrink',
       }
    },
    props: {
        menuList: {
            type: Array
        },
        iconColor: {
            type: String,
            default: 'white'
        },
        menuTheme: {
            type: String,
            default: 'darck'
        }
    },
    watch:{
        menuList(){
            // console.log(this.menuList)
        }
    },
    mounted() {
        // this.init()
    },
    methods: {
        init(){

        },
        changeMenu (active,item) {
            this.$emit('on-change', active,item);
        },
        itemTitle (item) {
            if (typeof item.title === 'object') {
                return (item.title.i18n);
            } else {
                return item.title;
            }
        }
    }
};
</script>
<style>
#noChild .ivu-icon-arrow-right-b{
    display: none
}
</style>
