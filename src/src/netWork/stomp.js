import {DeviceEventEmitter} from 'react-native';

let queueName = '';
let routingKey1 = 'e2b6ff53-3cb5-4dc9-95e0-d7cad28fa7e6';
let WebSocketInstance = undefined;
let client = undefined;

const connectStomp = (routingKey) => {
  if (!WebSocketInstance) {
    WebSocketInstance = new WebSocket("ws://message.ehaier.com:8080/ws");
  }

  queueName = "stomp-subscription" + uuid();
  client = Stomp.over(WebSocketInstance);


  client.connect(
    "message_user_ro", "nYXPFND2",
    () => {

      console.log("链接成功");

      client.subscribe('/exchange/message_fanout_exchange', function (d) {

        console.log("message_fanout_exchange:" + d.body);

      }, {'x-queue-name': queueName});


      // client.subscribe('/exchange/message_topic_exchange/' + routingKey, function (d) {
      //   console.log("message_topic_exchange:" + d.body);
      // }, {'x-queue-name': queueName});

      client.subscribe('/exchange/message_topic_exchange/' + routingKey1, function (d) {

        console.log("message_topic_exchange:" + d.body);

      }, {'x-queue-name': queueName});

    },
    () => {
      console.log("链接失败")
    }, '/'
  );
};

function uuid() {
  let s = [];
  let hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
  return s.join("");
}

export {connectStomp};