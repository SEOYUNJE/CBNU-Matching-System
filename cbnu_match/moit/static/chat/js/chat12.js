function getCSRFToken() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}
document.addEventListener('DOMContentLoaded', async () => {
    // html 객체
    const meetTitle_ul = document.getElementById('meetTitle-ul');
    const meetTitle_h2 = document.getElementById('meetTitle-h2');
    const participant_ul = document.getElementById('participant-ul');
    const participantCount_span = document.getElementById('participantCount-span');
    
    const send_Button = document.getElementById('send-Button');
    const message_Input = document.getElementById('message-Input');

    const messages = document.getElementById('messages');
    // WebSocket 객체

    // 변수
    let meet_id = null;
    let user_id = null;
    let socket = null;
    let cur_user = null;
    let lastDate = null;

    // Function ==============================================================================================================================
    function initialize_meet(meet) {
        // li 객체 생서 및 metitle ul에 부착
        const li = document.createElement('li');
        li.textContent = meet.title;
        meetTitle_ul.appendChild(li);
        
        // Add Click Event
        li.addEventListener('click', () => {
            // Set Room Title
            meetTitle_h2.textContent = meet.title;

            // cur_participant / max_participant
            participantCount_span.textContent = `모집인원 ${meet.participants_profile.length}/${parseInt(meet.max_member)}`;

            // Reset Participant-ul
            participant_ul.innerHTML = "";

            // create member
            meet.participants_profile.forEach(item => {
                initialize_participant(item);
            })

            // Initialize Chat History
            meet_id = meet.id;
            Initialize_Chat(meet.id);

            // Connect WebSocket
            if(socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
            socket = new WebSocket(`ws://${window.location.host}/ws/chat/${meet.id}/`)
            socket.onmessage = function (e) {
                const data = JSON.parse(e.data);
                console.log(data);
                create_messageHTML(data, cur_user, lastDate)
                console.log('받은 메시지:', data.sender);
            }
        });
    }

    function initialize_participant(participant) {
        // Debug
        console.log('실행됨');
        console.log(participant.profile_img);

        // Create li
        const li = document.createElement('li');

        // div.avatar
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';

        // img
        const img = document.createElement('img');
        img.src = participant.profile_img;
        avatarDiv.appendChild(img);

        const p = document.createElement('p');
        p.textContent = participant.nickname;
        
        li.appendChild(avatarDiv);
        li.appendChild(p);

        participant_ul.appendChild(li);
    }

    async function Initialize_Chat(meet_id) {
        try {
            const response = await fetch(`/chat/get_chat_api/?meet_id=${meet_id}`)
            const data = await response.json()
            if(data.code === 'Successed') {
                if(data.data[1] == null) return;

                messages.innerHTML = "";
                data.data.forEach(item => {
                    if(item.content === '초기화 완료!') return;

                    lastDate = create_messageHTML(item, cur_user, lastDate);
                });
            }
            else {
                throw new Error(data.message);
            }
        }
        catch (error) {
            console.log(error);
            alert('서버 오류');
        }
    }

    // DB 저장을 위해 Django Server 데이터 전송
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
        if(!message || socket.readyState !== WebSocket.OPEN) return;

        socket.send(JSON.stringify({
            message: message
        }))

        message_Input.value = '';
    }

    // Chat HTML 요소 추가
    function create_messageHTML(item, cur_user, lastDate) {
        const dateObj = new Date(item.created_at);

        const msgDateStr = dateObj.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });

        // 날짜 헤더 생성
        if (msgDateStr !== lastDate) {
            const dateContainer = document.createElement('div');
            dateContainer.className = 'chat-date-container';

            const dateInner = document.createElement('div');
            dateInner.className = 'chat-date';

            const icon = document.createElement('i');
            icon.className = 'bi bi-calendar-event';

            const span = document.createElement('span');
            span.textContent = msgDateStr;

            dateInner.appendChild(icon);
            dateInner.appendChild(span);
            dateContainer.appendChild(dateInner);

            messages.appendChild(dateContainer);
        }

        const dateStr = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

        if (cur_user === item.sender_profile.id) {
            const msgSent_div = document.createElement('div');
            msgSent_div.className = 'msg sent';

            const bubble_div = document.createElement('div');
            bubble_div.className = 'bubble';

            const message_p = document.createElement('p');
            message_p.textContent = item.content.trim();

            const time = document.createElement('time');
            time.textContent = dateStr;

            bubble_div.appendChild(message_p);
            msgSent_div.appendChild(bubble_div);
            msgSent_div.appendChild(time);

            messages.appendChild(msgSent_div);
        } else {
            const msgReceived_div = document.createElement('div');
            msgReceived_div.className = 'msg-header';

            const avatar_div = document.createElement('div');
            avatar_div.className = 'avatar';

            const avatar_img = document.createElement('img');
            avatar_img.src = item.sender_profile.profile_img;

            const senderName_p = document.createElement('p');
            senderName_p.textContent = item.sender_profile.nickname;

            avatar_div.appendChild(avatar_img);
            msgReceived_div.appendChild(avatar_div);
            msgReceived_div.appendChild(senderName_p);

            const message_div = document.createElement('div');
            message_div.className = 'msg';

            const bubble_div = document.createElement('div');
            bubble_div.className = 'bubble';

            const message_p = document.createElement('p');
            message_p.textContent = item.content.trim();

            const time = document.createElement('time');
            time.textContent = dateStr;

            bubble_div.appendChild(message_p);
            message_div.appendChild(bubble_div);
            message_div.appendChild(time);

            messages.appendChild(msgReceived_div);
            messages.appendChild(message_div);
        }

        return msgDateStr;
    }


    // main
    try {
        const response = await fetch('/chat/get_meet_api/');
        const data = await response.json();

        cur_user = data.user;

        // 모임 추가
        data.meet_list.forEach(item => {
            initialize_meet(item);
        });

        // 자동으로 최상위 모임 선택
        if(data.meet_list.length > 0) {
            const first_Li = meetTitle_ul.querySelector('li');
            if (first_Li) first_Li.click();
        }
    }
    catch(error) {
        console.log(error);
    }

    // 객체 이벤트
    send_Button.addEventListener('click', () => {

        console.log(message_Input);
        console.log(send_Button);

        send_message(message_Input.value.trim());
    })
})