// Get CSRF-Token
function getCSRFToken() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}

document.addEventListener('DOMContentLoaded', async () => {
    // html 객체 =========================================================================================================
    // 왼쪽 모임 리스트
    const meetList_ul = document.getElementById('meetList-ul');

    // 오른쪽 참여자 리스트
    const participantList_ul = document.getElementById('participantList-ul');

    // 채팅 제목
    const chattingTitle_h2 = document.getElementById('chattingTitle-h2');

    // 모임 참가 인원
    const participantCount_span = document.getElementById('participantCount-span');

    // 메시지
    const message_Input = document.getElementById('message-Input');
    const messageSend_Button = document.getElementById('messageSend-Button');
    const chattingContainer_div = document.getElementById('chattingContainer-div');

    // 변수 ===============================================================================================================
    let meet_id;
    let user_id;

    let websocket;

    let prev_timeObj;
    let prev_dateObj;
    let prev_User_id;


    // 함수 ========================================================================================================================
    function Initialize(meet) {
        // 모임 리스트 추가
        const li = document.createElement('li');
        li.textContent = meet.title;
        meetList_ul.appendChild(li);

        li.addEventListener('click', async () => {
            // 채팅 제목 설정 및 모임 첨여자 수 불러오기
            chattingTitle_h2.textContent = meet.title;
            meet_id = meet.id;
            participantCount_span.textContent = `모집인원 ${meet.participants_profile.length}/${parseInt(meet.max_member)}`;

            // 초기화
            participantList_ul.innerHTML = "";
            chattingContainer_div.innerHTML = '';
            prev_User_id = null;
            prev_dateObj = null;
            prev_timeObj = null;

            // 참여자 프로필 가져오기
            meet.participants_profile.forEach(item => {
                const li = document.createElement('li');

                const avatar_div = document.createElement('div');
                avatar_div.className = 'avatar';

                const img = document.createElement('img');
                img.src = item.profile_img;

                avatar_div.appendChild(img);

                const p = document.createElement('p');
                p.textContent = item.nickname;

                li.appendChild(avatar_div);
                li.append(p);

                participantList_ul.appendChild(li);
            })

            // 채팅 가져오기
            try {
                const res = await fetch(`/chat/get_chat_api/?meet_id=${meet_id}`)
                const data = await res.json();

                console.log(data.data);

                if(data.code === 'Failed') return new Error(data.message);
                
                chattingContainer_div.innerHTML = '';

                data.data.forEach(item => {
                    // DB 초기화 코드 무시
                    if(item.content === '초기화 완료!') return;

                    // 날짜 확인용 날짜 태그 추가 코드
                    const dateObj = new Date(item.created_at);

                    if(!prev_dateObj) {
                        create_dateHTML(get_date(item.created_at));
                    }
                    else if(dateObj.getDate() !== prev_dateObj.getDate()) {
                        create_dateHTML(get_date(item.created_at));
                    }


                    if(parseInt(item.sender_profile.id) === parseInt(user_id)) {
                        console.log('싫애됨');
                        create_myChatHTML(item);
                        prev_dateObj = dateObj;
                        return
                    }

                    create_otherChatHTML(item);
                    prev_dateObj = dateObj;
                })
            }
            catch (error) {
                alert('서버 오류');
                console.log(error);
            }

            // Connect WebSocket
            if(websocket && websocket.readyState === WebSocket.OPEN) {
                websocket.close();
            }
            websocket = new WebSocket(`ws://${window.location.host}/ws/chat/${meet_id}/`)
            websocket.onmessage = function (e) {
                const data = JSON.parse(e.data);
                console.log(data);
                if(parseInt(data.sender_profile.id) === parseInt(user_id)) {
                    create_myChatHTML(data);
                    prev_User_id = user_id;
                }
                else {
                    if(parseInt(data.sender_profile.id) === parseInt(prev_User_id)) {
                        create_otherChatHTML(data);
                        prev_User_id = data.sender_profile.id;
                    }
                    else {
                        create_otherChatHTML(data);
                        prev_User_id = data.sender_profile.id;
                    }
                }
                console.log('받은 메시지:', data.sender);
                chattingContainer_div.scrollTop = chattingContainer_div.scrollHeight;
            }
        })
    }

    function get_date(date) {
        const dateObj = new Date(date);

        return dateObj.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
    }

    function create_dateHTML(date) {
        const dateContainer = document.createElement('div');
        dateContainer.className = 'chat-date-container';

        const dateInner = document.createElement('div');
        dateInner.className = 'chat-date';

        const icon = document.createElement('i');
        icon.className = 'bi bi-calendar-event';

        const span = document.createElement('span');
        span.textContent = date;

        dateInner.appendChild(icon);
        dateInner.appendChild(span);
        dateContainer.appendChild(dateInner);

        chattingContainer_div.appendChild(dateContainer);
    }

    // function create_myChatHTML(chat) {
    //     const dateObj = new Date(chat.created_at);
    //     const dateStr = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

    //     const msgSent_div = document.createElement('div');
    //     msgSent_div.className = 'msg sent';

    //     const bubble_div = document.createElement('div');
    //     bubble_div.className = 'bubble';

    //     const message_p = document.createElement('p');
    //     message_p.textContent = chat.content.trim();

    //     const time = document.createElement('time');
    //     time.textContent = dateStr;

    //     bubble_div.appendChild(message_p);
    //     msgSent_div.appendChild(bubble_div);
    //     msgSent_div.appendChild(time);

    //     chattingContainer_div.appendChild(msgSent_div);
    // }

    // function create_otherChatHTML(chat, previousChat_div = null) {
    //     const dateObj = new Date(chat.created_at);
    //     const dateStr = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

    //     const msgReceived_div = document.createElement('div');
    //     msgReceived_div.className = 'msg received';

    //     if(!previousChat_div) {
    //         const msg_header = document.createElement('div');
    //         msg_header.className = 'msg-header';

    //         const avatar_div = document.createElement('div');
    //         avatar_div.className = 'avatar';

    //         const avatar_img = document.createElement('img');
    //         avatar_img.src = chat.sender_profile.profile_img;

    //         const senderName_p = document.createElement('p');
    //         senderName_p.textContent = chat.sender_profile.nickname;

    //         avatar_div.appendChild(avatar_img);

    //         msg_header.appendChild(avatar_div);
    //         msg_header.appendChild(senderName_p);

    //         msgReceived_div.appendChild(msg_header);
    //         chattingContainer_div.appendChild(msgReceived_div);

    //         console.log('asdfasdfasdfasfasdf');
    //     }

    //     const msg_body = document.createElement('div');
    //     msg_body.className = 'msg-body';

    //     const bubble_div = document.createElement('div');
    //     bubble_div.className = 'bubble';

    //     const message_p = document.createElement('p');
    //     message_p.textContent = chat.content.trim();

    //     const time = document.createElement('time');
    //     time.textContent = dateStr;

    //     bubble_div.appendChild(message_p);

    //     msg_body.appendChild(bubble_div);
    //     msg_body.appendChild(time);

    //     if(!previousChat_div) {
    //         msgReceived_div.appendChild(msg_body);
    //         return msgReceived_div;
    //     }

    //     previousChat_div.appendChild(msg_body);
    //     return previousChat_div;
    // }

    async function send_message(message) {
        try {
            if(!message) return;
            const response = await fetch('/chat/send_message_api/', {
                method: "POST",
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify({ 
                    message: message,
                    meet_id: meet_id,
                }),
            });
            const data = await response.json();
        }
        catch (error) {
            console.log(error);
        }
        if(!message || websocket.readyState !== WebSocket.OPEN) return;

        websocket.send(JSON.stringify({
            message: message
        }))

        message_Input.value = '';
    }

    function create_myChatHTML(chat) {
        const dateObj = new Date(chat.created_at);
        const dateStr = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

        const msgSent_div = document.createElement('div');
        msgSent_div.className = 'msg sent';

        const bubble_div = document.createElement('div');
        bubble_div.className = 'bubble';

        const content_p = document.createElement('p');
        content_p.textContent = chat.content;

        bubble_div.appendChild(content_p);
        msgSent_div.appendChild(bubble_div);

        if(prev_User_id) {
            if(parseInt(prev_User_id) === parseInt(user_id) && dateObj.getMinutes() === prev_dateObj.getMinutes()) {
                prev_timeObj.remove();

                const time = document.createElement('time');
                time.textContent = dateStr;

                prev_timeObj = time;

                msgSent_div.appendChild(prev_timeObj);
                chattingContainer_div.appendChild(msgSent_div);
                return;
            }
        }

        const time = document.createElement('time');
        time.textContent = dateStr;

        prev_timeObj = time;

        msgSent_div.appendChild(prev_timeObj);
        
        prev_User_id = chat.sender_profile.id;
        chattingContainer_div.appendChild(msgSent_div);
    }

    function create_otherChatHTML(chat) {
        const dateObj = new Date(chat.created_at);
        const dateStr = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

        const msgReceived_div = document.createElement('div');
        msgReceived_div.className = 'msg received';

        const msgHeader_div = document.createElement('div');
        msgHeader_div.className = 'msg-header';

        if(prev_User_id) {
            if(parseInt(chat.sender_profile.id) === parseInt(prev_User_id)) {
                if(dateObj.getMinutes() === prev_dateObj.getMinutes()) {
                    const msgBody_div = document.createElement('div');
                    msgBody_div.className = 'msg-body';

                    const bubble_div = document.createElement('div');
                    bubble_div.className = 'bubble';

                    const content_p = document.createElement('p');
                    content_p.textContent = chat.content;

                    bubble_div.appendChild(content_p);
                    msgBody_div.appendChild(bubble_div);


                    prev_timeObj.remove();

                    const time = document.createElement('time');
                    time.textContent = dateStr;

                    prev_timeObj = time;

                    msgBody_div.appendChild(prev_timeObj);
                    msgReceived_div.appendChild(msgHeader_div);
                    msgReceived_div.appendChild(msgBody_div);
                    chattingContainer_div.appendChild(msgReceived_div);
                    return;
                }
                else {
                    const msgBody_div = document.createElement('div');
                    msgBody_div.className = 'msg-body';

                    const bubble_div = document.createElement('div');
                    bubble_div.className = 'bubble';

                    const content_p = document.createElement('p');
                    content_p.textContent = chat.content;

                    bubble_div.appendChild(content_p);
                    msgBody_div.appendChild(bubble_div);

                    const time = document.createElement('time');
                    time.textContent = dateStr;

                    prev_timeObj = time;

                    msgBody_div.appendChild(prev_timeObj);

                    msgBody_div.appendChild(prev_timeObj);
                    msgReceived_div.appendChild(msgHeader_div);
                    msgReceived_div.appendChild(msgBody_div);
                    chattingContainer_div.appendChild(msgReceived_div);
                    return;
                }
            }
        }

        const avatar_div = document.createElement('div');
        avatar_div.className = 'avatar';
        const img = document.createElement('img');
        img.src = chat.sender_profile.profile_img;

        const senderName_p = document.createElement('p');
        senderName_p.className = 'sender-name';
        senderName_p.textContent = chat.sender_profile.nickname;

        avatar_div.appendChild(img);
        msgHeader_div.appendChild(avatar_div);
        msgHeader_div.appendChild(senderName_p);

        const msgBody_div = document.createElement('div');
        msgBody_div.className = 'msg-body';

        const bubble_div = document.createElement('div');
        bubble_div.className = 'bubble';

        const content_p = document.createElement('p');
        content_p.textContent = chat.content;

        const time = document.createElement('time');
        time.textContent = dateStr;

        prev_timeObj = time;

        msgBody_div.appendChild(prev_timeObj);

        bubble_div.appendChild(content_p);
        msgBody_div.appendChild(bubble_div);

        msgReceived_div.appendChild(msgHeader_div);
        msgReceived_div.appendChild(msgBody_div);

        chattingContainer_div.appendChild(msgReceived_div);

        prev_User_id = chat.sender_profile.id;
    }

    // main =====================================================================================================================================
    try {
        const res = await fetch('/chat/get_meet_api/');
        const data = await res.json();

        if(data.code === 'Failed') throw new Error(data.message);

        user_id = data.user;

        data.meet_list.forEach(item => {
            console.log(item.title);
            Initialize(item);
        });

        if(data.meet_list.length > 0) {
            const first_Li = meetList_ul.querySelector('li');
            if (first_Li) first_Li.click();
        }
    }

    catch (error) {
        alert('서버 오류!');
        // window.location.replace('/main/');
        console.log(error);
    }

    messageSend_Button.addEventListener('click', () => {

        console.log(message_Input);

        send_message(message_Input.value.trim());
    })


    // 신고하기
    const ReportPrompt = document.getElementById('ReportPrompt');
    const CloseReportPrompt = document.getElementById('CloseReportPrompt');
    const ReportForm = document.getElementById('ReportForm');
    const submitReportBtn = document.getElementById('submitReportBtn');

    // [X] 닫기
    CloseReportPrompt.addEventListener('click', () => {
        ReportPrompt.classList.remove('show');
    });
    // 바깥 클릭 시 닫기
    window.addEventListener('click', (e) => {
        if (e.target === ReportPrompt) ReportPrompt.classList.remove('show');
    });

    const container = document.getElementById('chattingContainer-div');
    let selectedComment = null;

    container.addEventListener('click', (e) => {
        const bubble = e.target.closest('.bubble');
        if (bubble) {
            selectedComment = bubble.innerText.trim();
            showReportBox(bubble, e.pageX, e.pageY);
            e.stopPropagation(); // 이벤트 버블링 막기 (문서 클릭 이벤트가 바로 안 먹게)
            }
        });

    document.addEventListener('click', (e) => {
    const reportBox = document.getElementById('mini-report-box');
    if (reportBox) {
        e.stopPropagation();
        ReportPrompt.classList.add('show')
    if (!e.target.closest('.bubble') && !e.target.closest('#mini-report-box')) {
      reportBox.remove();
        }
    }
    });

    function showReportBox(bubble) {
    let reportBox = document.getElementById('mini-report-box');

    if (!reportBox) {
        reportBox = document.createElement('div');
        reportBox.id = 'mini-report-box';
        reportBox.innerText = '댓글 신고';
        document.body.appendChild(reportBox);
    }

    const rect = bubble.getBoundingClientRect();

    // 스크롤 위치까지 고려해서 계산
    const left = window.scrollX + rect.right + 8;  // 댓글 오른쪽 끝 + 8px 간격
    const top = window.scrollY + rect.top + (rect.height - reportBox.offsetHeight) / 2; // 댓글 세로 중앙

    reportBox.style.position = 'absolute';
    reportBox.style.left = left + 'px';
    reportBox.style.top = top + 'px';
    }

    // 신고 사유 버튼 클릭 -> 제출
    // 유효성 상태 플래그 검사
    let isReasonSelected = false;

    // 유효성 검사 통과 시 버튼 활성화
    function checkReportValid() {
        // 하나라도 선택된 버튼이 있으면 true
        const selectedReasons = document.querySelectorAll('.reason-btn.selected');
        isReasonSelected = selectedReasons.length > 0;

        submitReportBtn.disabled = !isReasonSelected;
    }
	
    const reasonButtons = document.querySelectorAll('.reason-btn');

    reasonButtons.forEach(button => {
        button.addEventListener('click', () => {
        button.classList.toggle('selected');

        // 유효성 상태 변경
        isReasonSelected = true;
        checkReportValid();
    });
    });



    // [신고하기] 버튼 클릭 시: 신고 중복 확인하기 
  document.getElementById('ReportForm').addEventListener('submit', function (e) {
    e.preventDefault();

    submitReportBtn.disabled = true;

	// 선택된 사유 가져오기
    const selectedBtn = document.querySelector('.reason-btn.selected');
	const reason = selectedBtn.textContent;
	    
    fetch('/chat/report_api/', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken()
      },
      body: JSON.stringify({
		reason: reason,
		comment: selectedComment,
		})
      })
      .then(response => response.json())
      .then(data => {
      if (data.message) {
		  alert(data.message)
          ReportPrompt.classList.remove('show');
      }
      else if (data.error) {
		  // 신고를 중복해서 할수 없습니다.
          alert(`${data.error}`);
        }
      })
      .catch(() => {
          alert("서버 오류가 발생했습니다.");
      });
    });
})