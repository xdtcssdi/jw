<template>

  <div class="main-login">
    <lyz-layout
        :pagination="pagination"
        :label="label"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange">


      <div slot="banner" class="top-right">

      </div>

      <div slot="main" class="main-body">
        <el-table
            :data="tableData"
            stripe
            v-loading="loginLoading"
            tooltip-effect="light"
            height="100%"
            style="width: 100%"
            @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
              v-for="(data,index) in tableHeader"
              :show-overflow-tooltip="true"
              :key="index"
              :prop="data.prop"
              :label="data.label"
              :min-width="data['min-width']"
              :align="data.align">
          </el-table-column>

        </el-table>


      </div>
    </lyz-layout>


    <div>
      <beautiful-chat
          :title="chatTitle"
          :participants="participants"
          :titleImageUrl="titleImageUrl"
          :onMessageWasSent="onMessageWasSent"
          :messageList="messageList"
          :newMessagesCount="newMessagesCount"
          :isOpen="isChatOpen"
          :close="closeChat"
          :icons="icons"
          :open="openChat"
          :showEdition="true"
          :showDeletion="true"
          :showTypingIndicator="showTypingIndicator"
          :showLauncher="true"
          :showCloseButton="true"
          :colors="colors"
          :alwaysScrollToBottom="alwaysScrollToBottom"
          :messageStyling="messageStyling"
          @onType="handleOnType"
          @edit="editMessage"/>
    </div>

  </div>


</template>


<script src="http://cdn.bootcss.com/stomp.js/2.3.3/stomp.min.js"></script>
<script src="https://cdn.bootcss.com/sockjs-client/1.1.4/sockjs.min.js"></script>


<script>

import lyzLayout from '@/components/lyzLayout';
import manage from '../manage.component';
import {responseText} from '../../../config/utils.js';
import CloseIcon from 'vue-beautiful-chat/src/assets/close-icon.png'
import OpenIcon from 'vue-beautiful-chat/src/assets/logo-no-bg.svg'
import FileIcon from 'vue-beautiful-chat/src/assets/file.svg'
import CloseIconSvg from 'vue-beautiful-chat/src/assets/close.svg'


export default {
  name: "address",
  data() {
    return {
      queryType: '',
      queryKeyword: '',
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      },
      label: '通讯录管理',
      chatTitle:'聊天室',
      messageForm: {},
      toUser: '',
      messageVisible: false,
      messageLabelWidth: '90px',
      isModify: false,
      u_type: localStorage.type,
      u_name: localStorage.username,
      multipleSelection: [],//多选的数据
      pickerOptions: {},
      tableData: [],
      webSocket: '',
      loginLoading: false,
      tableHeader: [
        {
          prop: 'username',
          label: '用户名',
          'min-width': 60,
          align: 'center',
        },
        {
          prop: 'subject',
          label: '科目',
          'min-width': 60,
          align: 'center',
        },
        {
          prop: 'phone',
          label: '电话',
          'min-width': 60,
          align: 'center',
        },
        {
          prop: 'email',
          label: '邮箱',
          'min-width': 120,
          align: 'center',
        }
      ],
      icons: {
        open: {
          img: OpenIcon,
          name: 'default',
        },
        close: {
          img: CloseIcon,
          name: 'default',
        },
        file: {
          img: FileIcon,
          name: 'default',
        },
        closeSvg: {
          img: CloseIconSvg,
          name: 'default',
        },
      },
      participants: [
        {
          id: 'self',
          name: localStorage.username,
          imageUrl: 'https://avatars3.githubusercontent.com/u/37018832?s=200&v=4'
        }
      ], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
      titleImageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
      messageList: [
        // { type: 'text', author: localStorage.username, data: { text: 'Say yes!' } },
        // { type: 'text', author: `user1`, data: { text: `No.` } }
      ], // the list of the messages to show, can be paginated and adjusted dynamically
      newMessagesCount: 0,
      isChatOpen: false, // to determine whether the chat window should be open or closed
      showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
      colors: {
        header: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        launcher: {
          bg: '#4e8cff'
        },
        messageList: {
          bg: '#ffffff'
        },
        sentMessage: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        receivedMessage: {
          bg: '#eaeaea',
          text: '#222222'
        },
        userInput: {
          bg: '#f4f7f9',
          text: '#565867'
        }
      }, // specifies the color scheme for the component
      alwaysScrollToBottom: false, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
      messageStyling: true, // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)

    };
  },
  components: {
    lyzLayout,
  },
  mixins: [manage],
  created() {
    this.queryList();
    this.createWebSocket();
  },
  mounted() {
    if (this.u_type === 'teacher') {
      this.tableHeader = [
        {
          prop: 'username',
          label: '学生',
          'min-width': 60,
          align: 'center',
        },
        {
          prop: 'phone',
          label: '电话',
          'min-width': 60,
          align: 'center',
        },
        {
          prop: 'email',
          label: '邮箱',
          'min-width': 120,
          align: 'center',
        }
      ]
    }
  },
  methods: {
    queryList() {
      this.loginLoading = true;

      let params = {
        page: this.pagination.pageIndex,
        pageCount: this.pagination.pageSize,
        type: localStorage.type,
        id: localStorage.id
      };

      this.$http.get('http://localhost:8080/address/', {params: params}).then(({body}) => {
        if (body.success === true) {
          responseText(body.data.records);
          this.tableData = responseText(body.data.records);
          this.pagination.total = body.data.records ? body.data.total : 0;
        } else {
          this.$message.error(body.message);
        }
      }).finally(() => {
        this.loginLoading = false;
      })
    },
    sendMessage(text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
        this.onMessageWasSent({author: this.u_name, type: 'text', data: {text}})
      }
    },
    onMessageWasSent(message) {
      // called when the user sends a message
      if (this.toUser === '') {
        this.$message.error("未选择聊天对象");
        return;
      }
      this.messageList = [...this.messageList, message]

      this.webSocket.send(JSON.stringify({
        "message": message['data']['text'],
        "username": localStorage.username,
        "to": this.toUser
      }));
    },
    recMessageWasSent(message) {
      // called when the user sends a message
      this.messageList = [...this.messageList, message]
    },
    openChat() {
      // called when the user clicks on the fab button to open the chat
      this.isChatOpen = true
      this.newMessagesCount = 0
    },
    closeChat() {
      // called when the user clicks on the botton to close the chat
      this.isChatOpen = false
    },
    handleScrollToTop() {
      // called when the user scrolls message list to top
      // leverage pagination for loading another page of messages
    },
    handleOnType() {
      // console.log('Emit typing event')
    },
    editMessage(message) {
      const m = this.messageList.find(m => m.id === message.id);
      m.isEdited = true;
      m.data.text = message.data.text;
    }, createWebSocket() {
      if ("WebSocket" in window) {
        this.webSocket = new WebSocket("ws://localhost:8080/websocket/" + this.u_name);

        //连通之后的回调事件
        this.webSocket.onopen = function () {
          console.log("已经连通了websocket");
        };

        //接收后台服务端的消息
        this.webSocket.onmessage = this.onmessage;

        //连接关闭的回调事件
        this.webSocket.onclose = function () {
          console.log("连接已关闭...");
          // setMessageInnerHTML("连接已经关闭....");
        };
      } else {
        // 浏览器不支持 WebSocket
        alert("您的浏览器不支持 WebSocket!");
      }
    }, onmessage(evt) {
      var received_msg = evt.data;
      console.log("数据已接收:" + received_msg);
      var obj = JSON.parse(received_msg);
      if (obj['tousername'] === localStorage.username) {
        let message = {type: 'text', author: obj['fromusername'], data: {text: obj['textMessage']}};
        // this.messageList = [...this.messageList, message]
        this.recMessageWasSent(message);
        return;
      }
      console.log("可以解析成json:" + obj.messageType);
      //1代表上线 2代表下线 3代表在线名单 4代表普通消息
      if (obj.messageType == 1) {
        //把名称放入到selection当中供选择
        var onlineName = obj.username;
        console.log(onlineName);
        // var option = "<option>"+onlineName+"</option>";
        // $("#onLineUser").append(option);
        // setMessageInnerHTML(onlineName+"上线了");
      } else if (obj.messageType == 2) {
        $("#onLineUser").empty();
        var onlineName = obj.onlineUsers;
        var offlineName = obj.username;
        // var option = "<option>"+"--所有--"+"</option>";
        // for(var i=0;i<onlineName.length;i++){
        //   if(!(onlineName[i]==document.getElementById('username').value)){
        //     option+="<option>"+onlineName[i]+"</option>"
        //   }
        // }
        // $("#onLineUser").append(option);
        //
        // setMessageInnerHTML(offlineName+"下线了");
      } else if (obj.messageType == 3) {
        var onlineName = obj.onlineUsers;
        var option = null;
        // for(var i=0;i<onlineName.length;i++){
        //   if(!(onlineName[i]==document.getElementById('username').value)){
        //     option+="<option>"+onlineName[i]+"</option>"
        //   }
        // }
        // $("#onLineUser").append(option);
        console.log("获取了在线的名单" + onlineName.toString());
      } else {
        // setMessageInnerHTML(obj.fromusername+"对"+obj.tousername+"说："+obj.textMessage);
      }
    },
    handleSelectionChange(selection) {
      // this.multipleSelection = selection;
      this.checkedGh = selection[0];
      if (this.checkedGh !== undefined) {
        this.toUser = this.checkedGh.username;
        this.participants = [
          {
            id: 'self',
            name: localStorage.username,
            imageUrl: 'https://avatars3.githubusercontent.com/u/37018832?s=200&v=4'
          }, {
            id: 'to',
            name: this.toUser,
            imageUrl: 'https://avatars3.githubusercontent.com/u/37018832?s=200&v=4'
          }
        ]
      } else {
        this.toUser = '';
        this.participants = [
          {
            id: 'self',
            name: localStorage.username,
            imageUrl: 'https://avatars3.githubusercontent.com/u/37018832?s=200&v=4'
          }
        ]
      }

      if (selection.length > 1) {
        this.$refs.tb.clearSelection();
        this.$refs.tb.toggleRowSelection(selection.pop());
      }
    },


  }

}
</script>


<style scoped>
.main-login {
  height: 100%;
}

.danger-text {
  color: #F56C6C;
}

</style>
