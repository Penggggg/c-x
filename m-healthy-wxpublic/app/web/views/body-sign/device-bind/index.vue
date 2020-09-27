<template>
    <window-title
        name="设备绑定"
    >
        <div class="p-bodysign-device-bind-v2">

            <div
                v-if="active !== null "
                class="my-process-block"
            >
                <my-process
                    :active="active"
                    :options="[
                        '用户注册',
                        '账号绑定'
                    ]"
                />
            </div>

            <!-- 设备信息 -->
            <device-info>
                <svg
                    slot="icon"
                    class="my-icon"
                    aria-hidden="true"
                >
                    <use xlink:href="#icon-shouji" />
                </svg>
                <div slot="info">
                    <p>希科多参数生命体征监测仪</p>
                    <p>S/N：{{ snCode }}</p>
                </div>
            </device-info>

            <!-- 文案提示 -->
            <div
                class="tips"
                v-if="users.length === 0"
            >
                设备中没有用户信息，请先添加用户!
            </div>

            <!-- 用户列表 -->
            <div
                class="user-opt-list"
                v-if="users.length > 0" 
            >
                <div
                    :key="k"
                    class="user-opt"
                    v-for="(user, k) in users" 
                    @click="userOpt = user.createTime"
                >
                    <div class="bian">
                        <mu-radio
                            v-model="userOpt"
                            :value="user.createTime"
                            style="margin-right: 12px;"
                        />
                        <div class="user-name">
                            {{ user.nick }}
                            <span 
                                class="user-bound"
                                v-if="Number( user.isFollow )"
                            >
                                已关注
                            </span>
                        </div>
                    </div>
                    <div class="bian">
                        <div
                            class="user-bound"
                            v-if="Number( user.isBind ) !== 0"
                        >
                            已绑定
                        </div>
                        <div
                            class="user-edit"
                            @click="e => onTapEditPage( e, user )"
                        >
                            <mu-icon
                                size="18"
                                value="today"
                                class="edit-icon"
                                color="rgb(153, 153, 153)"
                            />编辑
                        </div>
                    </div>
                </div>
            </div>

            <!-- 添加设备用户 -->
            <div 
                class="add-btn-block"
                v-if="!hasBeenSuccess"
            >
                <div
                    class="add-btn"
                    @click="showAdd = true"
                >
                    <div class="add-icon">+</div>添加设备用户
                </div>
            </div>

            <!-- 绑定按钮 -->
            <div
                v-if="users.length > 0 && !hasBeenSuccess"
                class="bind-btn-block-block"
            >
                <div
                    @click="onBind"
                    class="bind-btn-block"
                    v-if="!!selectingUser && !Number( selectingUser.isBind)"
                >
                    绑定用户
                </div>
                <div
                    @click="onUnbind"
                    class="bind-btn-block"
                     v-if="!!selectingUser && !!Number( selectingUser.isBind)"
                >
                    取消绑定用户
                </div>
            </div>

            <!-- 关注按钮 -->
            <div
                v-if="users.length > 0"
                class="bind-btn-block-block"
            >
                <div
                    @click="onFollow"
                    class="bind-btn-block"
                    v-if="!!selectingUser && !!selectingUser.bindUserId && !Number( selectingUser.isFollow )"
                >
                    关注用户
                </div>
                <div
                    @click="onUnFollow"
                    class="bind-btn-block"
                    v-if="!!selectingUser && !!selectingUser.bindUserId && !!Number( selectingUser.isFollow )"
                >
                    取消关注用户
                </div>
            </div>
       
            <!-- 绑定成功 -->
            <div
                class="success-block"
                 v-if="hasBeenSuccess"
            >
                <div class="icon-block">
                    <svg class="my-icon" aria-hidden="true">
                        <use xlink:href="#icon-chenggong"></use>
                    </svg>
                </div>
                <div class="success-info-block">
                    <div class="info-title">
                        恭喜，绑定成功！
                    </div>
                    <p v-if="lastBindUser">设备用户：{{ lastBindUser.nick }}</p>
                    <p v-if="lastBindUser">视源健康用户：{{ lastBindUser.bindUserName }}</p>
                </div>
            </div>

            <!-- 成功按钮 -->
            <div
                class="success-btn-block"
                 v-if="hasBeenSuccess"
            >
                <div
                    class="btn"
                    @click="onClose"
                >
                    确定
                </div>
            </div>

            <!-- 修改用户弹页 -->
            <my-drawer
                title="修改设备用户"
                :show.sync="showEditPage"
            >
                <div class="edit-block">

                    <div
                        class="edit-item"
                        :key="k"
                        v-for="(item, k) in userInfoList$"
                    >
                        <div class="edit-label">
                            {{ item.label }}
                        </div>
                        <div class="edit-value">
                            {{ item.value }}
                        </div>
                    </div>

                    <div class="edit-btn-block mt">
                        <div
                            class="edit-btn"
                            @click="onTapEdit"
                        >
                            编辑
                        </div>
                    </div>

                    <div class="edit-btn-block">
                        <div
                            @click="toggleBind( editingUser )"
                            class="edit-btn invert mr"
                        >
                            {{
                                !!editingUser && Number( editingUser.isBind ) ? '解除绑定' : '绑定'
                            }}
                        </div>
                        <div
                            @click="showDelete = true"
                            class="edit-btn invert"
                        >
                            删除用户
                        </div>
                    </div>

                </div>
            </my-drawer>


            <my-drawer
                title="添加用户"
                :show.sync="showAdd"
            >
                <div class="add-modal">
                    <my-form
                        ref="form1"
                        :meta="formMeta1"
                        :initializedData="formDefault"
                    />
                    <div :style="{ margin: '10px 0 0 0' }" v-if="isHandleUser">
                        <mu-checkbox
                            label="绑定账号"
                            v-model="addIsBind"
                        />
                    </div>
                    <div :style="{ color: '#ff2e2e', margin: '10px 0 0 0' }">
                        创建并绑定用户设备，健康管理员将实时监测您的异常测量结果，提供医疗干预方案
                    </div>
                    <div class="edit-btn-block mt np">
                        <div
                            @click="showAdd = false"
                            class="edit-btn invert mr"
                        >
                            取消
                        </div>
                        <div
                            @click="onAddUser"
                            class="edit-btn"
                        >
                            确认
                        </div>
                    </div>
                </div>   
            </my-drawer>

            <div
                class="show-add-suc"
                v-if="showAddSuccess"
            >
                <div class="add-user-success">
                    <div class="info">
                        <!-- <mu-icon size="76" value="check" color="green"></mu-icon> -->
                        <img src="/public/img/guide-2.png" alt="">
                        <p class="tips">账号创建成功啦，您可以使用设备进行测量啦～ </p>
                    </div>
                    <div class="btn">
                        <mu-button @click="confirmSuccess" full-width color="success">确定</mu-button>
                    </div>
                </div>
            </div>


            <!-- 修改用户弹框 -->
            <mu-dialog title="编辑用户" width="360" :open.sync="showEdit">
                <my-form
                    ref="form2"
                    :meta="formMeta2"
                />
                <mu-button
                    slot="actions"
                    flat
                    color="primary"
                    @click="showEdit = false"
                >
                    取消
                </mu-button>
                <mu-button
                    flat
                    slot="actions"
                    color="primary"
                    @click="onEditUser"
                >
                    确认
                </mu-button>
            </mu-dialog>

            <!-- 修改用户弹 确认框 -->
            <mu-dialog title="提示" width="360" :open.sync="showClear">
                您确定要解除绑定吗？
                <mu-button
                    slot="actions"
                    flat
                    color="primary"
                    @click="showClear = false"
                >
                    取消
                </mu-button>
                <mu-button
                    flat
                    slot="actions"
                    color="primary"
                    @click="onUnbind"
                >
                    确认
                </mu-button>
            </mu-dialog>

            <!-- 用户删除 确认框 -->
            <mu-dialog title="提示" width="360" :open.sync="showDelete">
                您确定要删除此用户吗？
                <mu-button
                    slot="actions"
                    flat
                    color="primary"
                    @click="showDelete = false"
                >
                    取消
                </mu-button>
                <mu-button
                    flat
                    slot="actions"
                    color="primary"
                    @click="onDelete"
                >
                    确认
                </mu-button>
            </mu-dialog>

            <!-- 关注框 -->
            <div
                class="follow-block"
                v-if="showFollow"
            >
                <div class="title">
                    尊敬的用户您好：
                </div>

                <div class="title">
                    请长按二维码关注“视源健康”公众号
                </div>

                <div class="btn-block">
                    <img
                        class="follow-img"
                        src="/public/img/qrcode.jpg"
                    />
                </div>
                <div class="param">
                    关注公众号后您可以：
                </div>
                <div class="param">
                    1、设备绑定及用户管理
                </div>
                <div class="param">
                    2、血压、血糖检查提醒
                </div>
                <div class="param">
                    3、享用视源健康慢病管理服务
                </div>
            </div>
        </div>
    </window-title>
</template>
<script lang="ts">
import { observe, toJS } from 'mobx';
import { inject } from '../../../service/inject';
import MyDrawer from '../../../components/my-drawer/index.vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import sktList from '../../../components/skeleton-list/index.vue';
import windowTitle from '../../../components/window-title/index.vue';
import deviceInfo from '../../../container/bodysidn-device-info/index.vue';
import MyForm from '../../../components/my-form-v2/index.vue';
import MyProcess from '../../../components/my-process/index.vue';

@inject({
    selector: ['account$']
})
@Component({
    components: {
        MyProcess,
        MyForm,
        sktList,
        deviceInfo,
        MyDrawer,
        windowTitle
    }
})
export default class P extends Vue {

    /** 展开关注框 */
    private showFollow = false;

    /** 是否需要有进度 */
    private hasActive = false;

    /** 当前进度 */
    private active: any = null;

    /** 是否成功过 */
    private hasBeenSuccess = false;

    /** 最新的绑定用户 */
    private lastBindUser: any = null;

    /** 选中的用户 */
    private selectingUser: any = null;

    /** 编辑中的用户 */
    private editingUser: any = null;

    /** 编辑用户信息(列表) */
    private userInfoList: any = [ ];

    /** 用户选择 */
    private userOpt = null;

    /** 解除绑定 */
    private showClear = false;

    /** 添加用户 */
    private showAdd = false;

    /** 添加成功页面 */
    private showAddSuccess = false;

    /** 添加的时候，是否绑定 */
    private addIsBind = true;

    /** 删除用户 */
    private showDelete = false;

    /** 编辑用户 */
    private showEdit = false;

    /** 编辑用户页面 */
    private showEditPage = false;

    /** 用户列表 */
    private users: any = [ ];

    /** 设备sn值 */
    private snCode = ''

    /** dn值 */
    private dnCode = '';

    /** sourceCode */
    private sourceCode = '';

    /** 是否本人使用 */
    private isHandleUser = true;

    /** 数据字典 */
    private dic: {
        [ key: string ] : {
            value: string,
            label: string
        }
    } = { };

    /** 表单默认值 */
    private formDefault = {
        user: 1,
        nick: '',
        gender: ''
    };

    private confirmSuccess() {
        const { sourceCode, snCode, dnCode, addIsBind } = this;
        this.showAddSuccess = false;
        this.fetchUsers( dnCode, sourceCode );
    }

    /** 常规form表单 */
    get commonForm(){ return [[
                {
                    key: 'user',
                    label: ' 使用人',
                    type: 'radio',
                    options: [
                        {
                            label: '自己使用',
                            value: 1
                        },{
                            label: '其他人使用',
                            value: 2
                        }
                    ],
                    rules: [{ 
                        validate: val => !!val ,
                        message: '必须选择使用者'
                    }],
                    onChange: (value) => {
                        const {name , gender} = this.account$.wx.systemUser;
                        if(value === 1) {  
                            this.formDefault = {
                                user: value,
                                nick: name,
                                gender: gender
                            }
                            this.isHandleUser = true;
                            this.addIsBind = true;
                            this.formMeta1 = this.commonForm
                        }
                        if(value === 2) {  
                            this.formDefault = {
                                user: value,
                                nick: '',
                                gender: ''
                            }
                            this.isHandleUser = false;
                            this.addIsBind = false;
                            this.formMeta1 = [...this.commonForm,...this.phoneForm]
                        }
                        
                    }
                }
            ], 
            [
                {
                    key: 'nick',
                    label: ' 姓名',
                    disabled: this.isHandleUser,
                    type: 'input',
                    rules: [{ 
                        validate: val => !!val && !!(String( val ).trim( )),
                        message: '必须填写姓名'
                    }]
                }
            ], [
                {
                    key: 'gender',
                    label: '性别',
                    disabled: this.isHandleUser,
                    type: 'select',
                    options: [{
                        label: '男',
                        value: 'M'
                    },{
                        label: '女',
                        value: 'F'
                    }],
                    rules: [{ 
                        validate: val => !!val,
                        message: '必须选择性别'
                    }]
                }
            ]]};

    /** 电话表单 */
    get phoneForm(){ return [
        [
                {
                    key: 'phone',
                    label: '电话',
                    type: 'input',
                    rules: [{ 
                        validate: val => !!val,
                        message: '必须输入电话'
                    },
                    {
                        validate: val => /^1\d{10}$/g.test(String(val)),
                        message: "号码为1开头的11位数字"
                    },
                    ]
                }
            ],
        [
        {
            saveKey: "personal-bind",
            label: "验证码",
            key: "verifycode",
            type: "verifycode",
            phonekey: "phone",
            url: "/api/common/verifycode",
            value: undefined,
            rules: [
                {
                validate: val => !!val,
                message: "必须填写验证码"
                }
            ]
        }
      ]
    ]};

    /** 添加用户表单 */
    private formMeta1: any[] = [];

    /** 编辑用户表单 */
    get formMeta2( ) {
        return [
            [
                {
                    key: 'nick',
                    label: ' 姓名',
                    type: 'input',
                    value: undefined,
                    rules: [{ 
                        validate: val => !!val && !!(String( val ).trim( )),
                        message: '必须填写姓名'
                    }]
                }
            ]
        ];
    }

    /** 编辑时候的用户信息 */   
    get userInfoList$( ) {
        const temp: any = [ ];
        const { editingUser } = this;

        if ( !editingUser ) { return temp; }
        ['nick', 'isBind', 'bindUserName', 'bindTime'].map( key => {
            if ( key === 'isBind' ) {
                temp.push({
                    label: '绑定状态',
                    value: Number( editingUser[ key ]) === 1 ? '已绑定' : '未绑定'
                });

            } else if ( key === 'bindTime' && !!editingUser[ key ]) {
                temp.push({
                    label: '绑定时间',
                    value: new Date( Number( editingUser[ key ])).toLocaleString( )
                })

            } else if ( key === 'nick' ) {
                temp.push({
                    label: '姓名',
                    value: editingUser[ key ]
                })
                
            } else if ( key === 'bindUserName' && !!editingUser[ key ]) {
                temp.push({
                    label: '绑定用户',
                    value: editingUser[ key ]
                })
                
            }
        });

        return temp;

    }

     /** 监听用户列表选项 */
    @Watch('userOpt')
    onUserOpt( val ) {
        const { users } = this;
        this.hasBeenSuccess = false;
        this.selectingUser = users.find( x => x.createTime === val );
    }

    /** 拉取数据字典 */
    private fetchDic( ) {
        const target = 'HMS_COMM_SEX'
        this.http$.get<Api.get.csbDic>({
            url: `/api/common/dic?typeCode=${target}`
        }, {
            errMsg: '加载错误',
            loadMsg: '加载中...'
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }

            let temp = { };
            target.split(',').map( key => {
                temp = Object.assign({ }, temp, {
                    [ key ]: data[ key ].map( x => ({
                        label: x.name,
                        value: x.itemValue
                    }))
                })
            });
            this.dic = temp;
        });
    }

    /** 拉取设备上的用户列表 */
    private fetchUsers( dn, sourceCode ) {
        if ( !dn || !sourceCode ) { return;}
        this.http$.get< any >({
            url: `/api/body-sign/device-userlist?sourceCode=${sourceCode}&dn=${dn}`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }

            this.users = data;
            const sortedUser = data
                .filter( x => !!x.bindTime )
                .sort(( x, y ) => y.bindTime - x.bindTime );
            data.length > 0 && (this.userOpt = this.users[0].createTime);
            this.showAdd = data.length === 0;
            this.lastBindUser = sortedUser[ 0 ];
            this.selectingUser = data.find( x => x.createTime === this.userOpt );
        })
    }

    /** 点击编辑用户按钮 */
    private onTapEdit( ) {
        this.showEdit = true;
        setTimeout(( ) => {
            (this as any).$refs.form2.set({
                nick: this.editingUser.nick
            })
        }, 100 );
    }

    /** 点击修改用户图标 */
    private onTapEditPage( e, target ) {

        e.stopPropagation( );

        const temp: any = [ ];
        this.showEditPage = true;
        this.editingUser = target;
    }

    /** 创建用户 */
    private onAddUser( e ) {
        e.stopPropagation( );
        const { sourceCode, snCode, dnCode, addIsBind } = this;
        const { result, data } = (this as any).$refs.form1.getData( );
        if ( !result ) {
            return this.$toast.error('请完善表单信息')
        }
        const reqData = Object.assign({ }, data, {
            sourceCode,
            deviceSn: dnCode,
            userId: this.account$.wx.systemUser.id
        });

        const fetch = () => {
            this.http$.post< any >({
                data: reqData,
                url: data.user === 1 ? (addIsBind ? `/api/body-sign/device-save-bind` : `/api/body-sign/device-save`) : '/api/body-sign/add-other'
            }, {
                loadMsg: '添加中...',
                successMsg: '添加成功！'
            }).then( res => {
                if ( res.status === 200 ) {
                    this.showAdd = false;
                    this.showAddSuccess = true;
                    // this.fetchUsers( dnCode, sourceCode );
                }
            });
        }
        data.user === 2 ?
        this.http$
            .post<normalResult<any>>(
                {
                data: {
                    verifycode:data.verifycode,
                    phone: data.phone
                },
                url: "/api/common/check-verifycode"
                },
                {
                loadMsg: "验证中...",
                errMsg: "验证码或手机号码错误"
                }
        ).then(res => {
            const { status } = res;
            if (status !== 200) {
            return;
            }
            fetch();
        
        })
        :fetch();


    }

    /** 编辑用户 */
    private onEditUser( ) {
        const { result, data } = (this as any).$refs.form2.getData( );
        if ( !result ) {
            return this.$toast.error('请完善表单信息')
        }
        const temp = Object.assign({ }, data, {
            deviceSn: this.dnCode,
            sourceCode: this.sourceCode,
            tag: this.editingUser.tag,
            userId: this.account$.wx.systemUser.id
        });

        this.http$.put< any >({
            data: temp,
            url: `/api/body-sign/device-update`
        }, {
            loadMsg: '修改中...',
            successMsg: '修改成功！'
        }).then( res => {
            if ( res.status === 200 ) {
                this.showEdit = false;
                this.showEditPage = false;
                this.fetchUsers( this.dnCode, this.sourceCode );
            }
        });
    }

    /** 绑定用户 */
    private onBind( e, user, cb ) {
        !!e && e.stopPropagation( );
        const { userOpt, dnCode, sourceCode, users } = this;
    
        if ( !userOpt && !user ) {
            return this.$toast.error('请选择一个用户')
        }

        const target = user || users.find( x => x.createTime === userOpt )

        const temp = {
            sourceCode,
            deviceSn: dnCode,
            deviceUserNick: target.nick,
            deviceTag: target.tag,
            userId: this.account$.wx.systemUser.id
        };

        this.http$.post< any >({
            data: temp,
            url: `/api/body-sign/device-bind-user`
        }, {
            loadMsg: '绑定中...',
            successMsg: '绑定成功！'
        }).then( res => {
            const { status, data } = res;
            if ( status === 200 ) {
                if ( this.hasActive ) {
                    this.active = 2;
                }
                this.hasBeenSuccess = true;
                this.fetchUsers( dnCode, sourceCode );
                !!cb && cb( );
            }
        })

    }

    /** 解除绑定用户 */
    private onUnbind( ) {
        const temp = {
            deviceSn: this.dnCode,
            sourceCode: this.sourceCode,
            deviceTag: this.showEditPage ? this.editingUser.tag : this.selectingUser.tag, 
            userId: this.account$.wx.systemUser.id
        };

        this.http$.post< any >({
            data: temp,
            url: `/api/body-sign/device-unbind`
        }, {
            loadMsg: '解除中...',
            successMsg: '解除成功！'
        }).then( res => {
            if ( res.status === 200 ) {
                if ( this.showEditPage ) {
                    this.showClear = false;
                    this.showEditPage = false;
                }
                this.fetchUsers( this.dnCode, this.sourceCode );
            }
        });
    }

    /** 关注用户 */
    private onFollow( e, user, cb ) {
        !!e && e.stopPropagation( );

        const { dnCode, sourceCode } = this;
        const selectingUser = user || this.selectingUser;

        if ( !selectingUser ) {
            return this.$toast.error('请选择一个用户')
        }

        if ( selectingUser.bindUserId === this.account$.wx.systemUser.id ) {
            return this.$toast.info('该用户是您本人，不能关注自己哦')
        }

        const temp = {
            sourceId: sourceCode,
            sourceDetailCode: dnCode,
            userTagDTOs: [{
                followTag: selectingUser.tag,
                followUserId: selectingUser.bindUserId,
            }],
            userId: this.account$.wx.systemUser.id
        };

        this.http$.post< any >({
            data: temp,
            url: `/api/body-sign/follow`
        }, {
            loadMsg: '关注中...',
            successMsg: '关注成功！'
        }).then( res => {
            const { status, data } = res;
            if ( status === 200 ) {
                this.fetchUsers( dnCode, sourceCode );
                !!cb && cb( );
            }
        })

    }

    /** 取消关注用户 */
    private onUnFollow( e ) {
        e.stopPropagation( );
        const { dnCode, sourceCode, selectingUser } = this;
        if ( !selectingUser ) {
            return this.$toast.error('请选择一个用户')
        }

        const temp = {
            sourceId: sourceCode,
            sourceDetailCode: dnCode,
            // followUserIds: selectingUser.bindUserId,
            userTagDTOs: [{
                followTag: selectingUser.tag,
                followUserId: selectingUser.bindUserId,
            }],
            userId: this.account$.wx.systemUser.id
        };

        this.http$.delete< any >({
            data: temp,
            url: `/api/body-sign/unfollow`
        }, {
            loadMsg: '取消关注...',
            successMsg: '取消成功！'
        }).then( res => {
            const { status, data } = res;
            if ( status === 200 ) {
                this.fetchUsers( dnCode, sourceCode );
            }
        })

    }

    /** 删除用户 */
    private onDelete( ) {
        this.http$.delete< any >({
            url: `/api/body-sign/device-delete?sourceCode=${this.sourceCode}&deviceSn=${this.dnCode}&tag=${this.editingUser.tag}`
        }, {
            loadMsg: '删除中...',
            successMsg: '删除成功！'
        }).then( res => {
            if ( res.status === 200 ) {
                this.showDelete = false;
                this.showEditPage = false;
                this.fetchUsers( this.dnCode, this.sourceCode );
            }
        });
    }

    /** 关闭/返回当前页面 */
    private onClose( ) {
         (window as any).WeixinJSBridge.call('closeWindow');
    }

    /** 在修改设备用户页面，选择绑定或者接触绑定 */
    private toggleBind( item ) {
        // 解除绑定
        if ( Number( item.isBind )) {
            this.showClear = true;
        // 绑定
        } else {
            this.onBind( null, item, ( ) => {
                this.editingUser = Object.assign({ }, item, {
                    isBind: '1'
                })
            });
        }
    }

    /** 初始化sn设备值 */
    private initSN( ) {

        const { dn, sc, active } = this.$route.query;
        this.dnCode = dn;
        this.sourceCode = sc;
        // console.log('我的参数',dn);
        this.snCode = dn.slice( dn.indexOf('Q'));

        let errMsg = '';
        if ( !dn ) {
            errMsg += 'dn参数';
        }
        if ( !sc ) {
            errMsg += ' sourceCode参数'
        }
        if ( !!errMsg ) {
            this.$toast.error(`${errMsg}为空！`)
        }

        if ( active ) {
            this.active = Number( active );
            this.hasActive = true;
        }

        this.fetchUsers( dn, sc );
    }

    /** 检查是否已关注 */
    private checkFolow( ) {
        const { f } = this.$route.query;
        this.showFollow = !Number( f );
    }

    private initForm(){
        const {name , gender} = this.account$.wx.systemUser;
        if(!!this.account$.wx.systemUser.id){
            this.formDefault = {
                user: 1,
                nick: name,
                gender: gender
            } 
             this.formMeta1 = this.commonForm ; 
        }

        observe( this.account$.wx, 'systemUser', change => {
            const {name , gender} = this.account$.wx.systemUser;
            this.formDefault = {
                user: 1,
                nick: name,
                gender: gender
            } 
             this.formMeta1 = this.commonForm ;   
        });
    }

    mounted( ) {    
        this.initForm(); 
        this.fetchDic( ); 
        this.initSN( );
        this.checkFolow( );
    }

}
</script>
<style lang="less">
@import './index.less';
</style>