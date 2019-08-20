Ext.onReady(function(){
    var operateRecord = {};
    let window = new Ext.Window({
        id:'window',
        title:'请输入信息',
        modal:true,
        width:300,
        height:200,
        layout:'form',
        labelWidth:70,
        labelAlign:'right',
        items:[
            {
                fieldLabel:'name',
                xtype:'textfield',
                emptyText:'请输入name'
            },
            {
                fieldLabel:'className',
                xtype:'textfield',
                emptyText:'请输入className'
            },
            {
                fieldLabel:'sex',
                xtype:'textfield',
                emptyText:'请输入sex'
            },
            {
                fieldLabel:'birthday',
                xtype:'datefield',
                format:'Y/m/d',
                emptyText:'请输入birthday'
            },
            {
                fieldLabel:'avatar',
                xtype:'textfield',
                emptyText:'请输入avatar'
            }
        ],
        buttons:[
            {
                text:'确定',
                handler:function(){
                    let inputValue = Ext.getCmp('window').items.items;
                    let name = inputValue[0].getValue();
                    let className = inputValue[1].getValue();
                    let sex = inputValue[2].getValue();
                    let birthday = inputValue[3].getValue();
                    let avatar = inputValue[4].getValue();

                    let record = new Ext.data.Record({
                        name:name,
                        className: className,
                        sex:sex,
                        birthday:birthday,
                        avatar:avatar                      
                    });

                    if(operateRecord.selectRowIndex == undefined || operateRecord.selectRowIndex == null)
                        store.insert(0,record);
                    else
                        store.insert(operateRecord.selectRowIndex,record);

                    for(let i = 0; i < inputValue.length; i++)
                        inputValue[i].setValue('');
                    window.hide();
                }
            },
            {
                text:'取消',
                handler:function(){
                    window.hide();
                }
            }
        ],
        listeners:{
            beforeclose:function(){
                window.hide();
                return false;
            }
        }
    });

    let menu = new Ext.menu.Menu({
        items:[
            {
                text:'add',
                handler:function(){
                    window.show();
                }
            }
        ]
    })


    let data = [
        ['刘一','A','male',new Date(),'1'],
        ['陈二','A','female',new Date(),'2'],
        ['张三','B','male',new Date(),'3'],
        ['李四','B','male',new Date(),'4'],
        ['王五','C','male',new Date(),'5']
    ]

    let cm = new Ext.grid.ColumnModel([
        {header:'name',dataIndex:'name'},
        {header:'class',dataIndex:'className'},
        {header:'sex',dataIndex:'sex'},
        {header:'birthday',dataIndex:'birthday',renderer: Ext.util.Format.dateRenderer('Y/m/d')},
        {header:'avatar',dataIndex:'avatar'}
    ]);

    let store = new Ext.data.Store({
        proxy: new Ext.data.PagingMemoryProxy(data),
        reader: new Ext.data.ArrayReader({},[
            {name:'name'},
            {name:'className'},
            {name:'sex'},
            {name:'birthday'},
            {name:'avatar'}
        ])
    });
    
    store.load();

    let grid = new Ext.grid.GridPanel({
        renderTo:'test',
        height:500,
        store:store,
        cm:cm,
        tbar:[{text:'总菜单',menu:menu}],
        listeners:{
            rowclick: function(grid, rowIndex){
                operateRecord.selectRowIndex = rowIndex;
            }
        }
    });
})