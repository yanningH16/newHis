export const editIncellColumns = [
    {
        title: '序号',
        type: 'index',
        width: 80,
        align: 'center'
    },
    {
        title: '角色名',
        align: 'center',
        key: 'role',
        editable: true
    },
    {
        title: '操作',
        align: 'center',
        width: 100,
        key: 'handle',
        render: (h, params) => {
            return h('div', [
                h('Button', {
                    props: {
                        type: 'error',
                        size: 'small'
                    },
                    on: {
                        click: () => {
                            this.remove(params.index)
                        }
                    }
                }, '删除')
            ]);
        }
    }
];


const tableData = {
    editIncellColumns:editIncellColumns
};

export default tableData;
