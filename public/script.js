// destinations.jsから必要な関数をインポート
// 実際のインポート方法はプロジェクトの環境に依存します
import {
    getEnglishDestination,
    isValidDestination,
    getDestinationImage // 新たにインポート
} from './utils/destinations.js';

// チャットボットの状態管理
const chatState = {
    step: 0,
    mbtiType: '',
    destinationType: '',
    budget: '',
    duration: '',
    season: '',
    companions: '',
    travelStyle: '',
    interests: [],
    messages: []
};

// 会話フロー定義
const chatFlow = [
    {
        type: 'greeting',
        message: 'こんにちは！🌈 MBTIトラベルアドバイザーへようこそ！あなたの性格タイプに合った最高の旅行プランを提案するよ！まずはあなたのMBTIタイプを教えてね！',
        options: [
            'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
            'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP',
            'わからない'
        ]
    },
    {
        type: 'destination',
        getMessage: (mbti) => `${mbti}タイプのあなたは、素敵な性格の持ち主だね！✨ 最高の旅行プランを考えていこう！まずは国内と海外、どっちに行きたい？`,
        options: ['国内', '海外']
    },
    {
        type: 'budget',
        domestic: {
            message: '国内旅行いいね！🗾 学生さんの予算ってけっこう大事だよね。予算はどれくらいあるかな？',
            options: ['節約重視（〜3万円）', '標準（3〜5万円）', 'ちょっと贅沢（5〜8万円）']
        },
        international: {
            message: '海外旅行いいね〜！🌍 学生さんの予算ってけっこう大事だよね。予算はどれくらいあるかな？',
            options: ['節約重視（〜8万円）', '標準（8〜15万円）', 'ちょっと贅沢（15〜25万円）']
        }
    },
    {
        type: 'duration',
        getMessage: (budget) => `${budget}の予算だね！いい感じに楽しめる金額だよ👍 次に、どのくらいの期間の旅行を考えてる？`,
        options: ['短め（3〜4日）', '1週間くらい', '長め（10日以上）']
    },
    {
        type: 'season',
        getMessage: (duration) => `${duration}の旅行だね！ベストな期間だと思う✈️ どの季節に行きたいかな？`,
        options: ['春', '夏', '秋', '冬', 'いつでもOK']
    },
    {
        type: 'companions',
        getMessage: (season) => {
            let seasonMsg = '過ごしやすくて観光にぴったりの季節だよ！🍂';
            
            if (season === '夏') {
                seasonMsg = '暑いけど思い出いっぱい作れそう！🌞';
            } else if (season === '冬') {
                seasonMsg = '寒いけど冬ならではの楽しみもあるよね！❄️';
            }
            
            return `${season}の旅行いいね！${seasonMsg} 誰と一緒に行く予定？`;
        },
        options: ['ひとり旅', '友達と', '恋人と', '家族と']
    },
    {
        type: 'travelStyle',
        getMessage: (companions) => `${companions}の旅行だね！次に、どんなタイプの旅行先がいい？王道の人気スポットと穴場どっちが好み？`,
        options: ['定番の人気スポット', 'ユニークな穴場スポット']
    },
    {
        type: 'interests',
        getMessage: (travelStyle) => `${travelStyle}を中心に考えるね！${travelStyle === '定番の人気スポット' ? '人気の観光地は外せないよね！😊' : '知る人ぞ知る穴場って素敵だよね！😊'} 最後に、特に何に興味がある？（複数選択OK）`,
        options: ['自然/景色', '芸術/博物館', '歴史/文化', 'グルメ/カフェ', 'SNS映えスポット', 'アクティビティ'],
        multiSelect: true
    },
    {
        type: 'result',
        message: '情報ありがとう！あなたにぴったりの旅行プランを考えているよ...',
        delay: 2000
    }
];

// DOMエレメント
const messagesContainer = document.getElementById('chat-messages');
const optionsContainer = document.getElementById('options-container');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const modal = document.getElementById('travel-plan-modal');
const modalContent = document.querySelector('.travel-plan-content');
const closeModal = document.querySelector('.close-modal');

// モーダル関連のイベント設定
if (closeModal) {
    closeModal.onclick = function() {
        modal.style.display = "none";
    }
}

// モーダル外クリックで閉じる
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// 初期メッセージを表示
window.onload = function() {
    displayBotMessage(chatFlow[0].message);
    displayOptions(chatFlow[0].options, false, false);
};

// メッセージ送信処理
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// メッセージ送信関数
function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;
    
    displayUserMessage(message);
    userInput.value = '';
    
    // ユーザーの回答を保存
    saveUserMessage(message);
    
    // APIでの処理
    if (chatState.step === 8) {
        // 最終ステップなのでAIに旅行プランを作成してもらう
        processCompletedForm();
    } else {
        // 次のステップに進む
        processUserInput(message);
    }
}

// ユーザーメッセージを保存
function saveUserMessage(message) {
    // 「戻る」ボタンが押された場合
    if (message === '← 戻る') {
        goToPreviousStep();
        return;
    }
    
    // メッセージ履歴に追加
    chatState.messages.push({
        role: 'user',
        content: message
    });
    
    // 各ステップに応じた情報を保存
    switch(chatState.step) {
        case 0:
            chatState.mbtiType = message;
            break;
        case 1:
            chatState.destinationType = message;
            break;
        case 2:
            chatState.budget = message;
            break;
        case 3:
            chatState.duration = message;
            break;
        case 4:
            chatState.season = message;
            break;
        case 5:
            chatState.companions = message;
            break;
        case 6:
            chatState.travelStyle = message;
            break;
        case 7:
            if (message !== '選択完了') {
                if (!chatState.interests.includes(message)) {
                    chatState.interests.push(message);
                }
                return; // 選択完了以外は次のステップに進まない
            }
            break;
    }
}

// 前のステップに戻る関数
function goToPreviousStep() {
    if (chatState.step <= 0) return; // 最初のステップでは戻れない
    
    // 前のステップの値をリセット
    switch(chatState.step) {
        case 1:
            chatState.mbtiType = '';
            break;
        case 2:
            chatState.destinationType = '';
            break;
        case 3:
            chatState.budget = '';
            break;
        case 4:
            chatState.duration = '';
            break;
        case 5:
            chatState.season = '';
            break;
        case 6:
            chatState.companions = '';
            break;
        case 7:
            chatState.travelStyle = '';
            break;
        case 8:
            chatState.interests = [];
            break;
    }
    
    // メッセージ履歴から最新の2つ（ユーザーとボットのメッセージ）を削除
    if (chatState.messages.length >= 2) {
        chatState.messages.pop(); // ボットのメッセージを削除
        chatState.messages.pop(); // ユーザーのメッセージを削除
    }
    
    // 前のステップに戻る
    chatState.step--;
    
    // メッセージ表示をリセット
    const messagesToKeep = Math.max(0, chatState.messages.length);
    
    // メッセージコンテナをクリア
    messagesContainer.innerHTML = '';
    
    // 残すメッセージを再表示
    for (let i = 0; i < messagesToKeep; i++) {
        const msg = chatState.messages[i];
        if (msg.role === 'user') {
            displayUserMessage(msg.content, false); // スクロールなし
        } else {
            displayBotMessage(msg.content, false); // スクロールなし
        }
    }
    
    // 現在のステップのメッセージと選択肢を表示
    displayCurrentStepOptions();
    
    // 最後にスクロールする
    scrollToBottom();
}

// 現在のステップの選択肢を表示
function displayCurrentStepOptions() {
    const currentStep = chatFlow[chatState.step];
    
    if (currentStep.type === 'budget') {
        const message = chatState.destinationType === '国内' 
            ? currentStep.domestic.message 
            : currentStep.international.message;
        
        const options = chatState.destinationType === '国内' 
            ? currentStep.domestic.options 
            : currentStep.international.options;
        
        displayBotMessage(message, false);
        displayOptions(options, false, true);
    }
    else if (['destination', 'duration', 'season', 'companions', 'travelStyle', 'interests', 'greeting'].includes(currentStep.type)) {
        // 前のステップの回答に基づいたメッセージを表示
        let prevResponse = '';
        switch(chatState.step - 1) {
            case 0: prevResponse = chatState.mbtiType; break;
            case 1: prevResponse = chatState.destinationType; break;
            case 2: prevResponse = chatState.budget; break;
            case 3: prevResponse = chatState.duration; break;
            case 4: prevResponse = chatState.season; break;
            case 5: prevResponse = chatState.companions; break;
            case 6: prevResponse = chatState.travelStyle; break;
        }
        
        const message = typeof currentStep.getMessage === 'function' 
            ? currentStep.getMessage(prevResponse) 
            : currentStep.message;
        
        displayBotMessage(message, false);
        
        if (currentStep.options) {
            displayOptions(currentStep.options, currentStep.multiSelect, true);
        }
    }
}

// ユーザー入力の処理
function processUserInput(message) {
    if (chatState.step < chatFlow.length - 1) {
        // 現在のステップを増加
        chatState.step++;
        
        // 次のボットメッセージを表示
        displayNextBotMessage();
    }
}

// 次のボットメッセージを表示
// 前回の続き
function displayNextBotMessage() {
    const currentStep = chatFlow[chatState.step];
    
    // 条件分岐処理
    if (currentStep.type === 'budget') {
        const message = chatState.destinationType === '国内' 
            ? currentStep.domestic.message 
            : currentStep.international.message;
        
        const options = chatState.destinationType === '国内' 
            ? currentStep.domestic.options 
            : currentStep.international.options;
        
        displayBotMessage(message);
        displayOptions(options, false, true); // 戻るボタンを表示
    }
    else if (['destination', 'duration', 'season', 'companions', 'travelStyle', 'interests'].includes(currentStep.type)) {
        // 前のステップの回答に基づいたメッセージを表示
        let prevResponse = '';
        switch(chatState.step - 1) {
            case 0: prevResponse = chatState.mbtiType; break;
            case 1: prevResponse = chatState.destinationType; break;
            case 2: prevResponse = chatState.budget; break;
            case 3: prevResponse = chatState.duration; break;
            case 4: prevResponse = chatState.season; break;
            case 5: prevResponse = chatState.companions; break;
            case 6: prevResponse = chatState.travelStyle; break;
        }
        
        const message = typeof currentStep.getMessage === 'function' 
            ? currentStep.getMessage(prevResponse) 
            : currentStep.message;
        
        displayBotMessage(message);
        
        if (currentStep.options) {
            displayOptions(currentStep.options, currentStep.multiSelect, true); // 戻るボタンを表示
        }
    }
    else if (currentStep.type === 'result') {
        // 入力が完了したので結果を生成
        displayBotMessage(currentStep.message);
        
        // タイピングインジケーターを表示
        showTypingIndicator();
        
        // 遅延後に結果を表示（実際はAPIリクエスト）
        setTimeout(() => {
            processCompletedForm();
        }, currentStep.delay);
    }
}

// フォーム完了後の処理（AIに旅行プランを作成してもらう）
async function processCompletedForm() {
    // タイピングインジケーターを表示
    showTypingIndicator();
    
    try {
        // APIにリクエストを送信
        const response = await fetch('/api/generate-travel-plan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mbtiType: chatState.mbtiType,
                destinationType: chatState.destinationType,
                budget: chatState.budget,
                duration: chatState.duration,
                season: chatState.season,
                companions: chatState.companions,
                travelStyle: chatState.travelStyle,
                interests: chatState.interests
            }),
        });
        
        const data = await response.json();
        
        // タイピングインジケーターを非表示
        hideTypingIndicator();
        
        if (data.error) {
            displayBotMessage('申し訳ありません、エラーが発生しました。もう一度試してください。');
            return;
        }
        
        // 画像キーワードの取得
        const imageKeyword = data.imageKeyword || extractImageKeyword(data.result) || '日本 観光地';
        
        // AIの応答を整形（画像キーワードも渡す）
        const formattedResult = formatTravelPlanResult(data.result, imageKeyword);
        
        // AIの応答を表示（プレビュー）
        displayBotMessage(`あなたにぴったりの旅行案ができました！✨ 
詳細を見るには「旅行案を見る」を選択してください。`);
        
        // モーダルに詳細を設定
        modalContent.innerHTML = formattedResult;
        
        // フォローアップの選択肢を表示
        const followupOptions = ['旅行案を見る', 'おすすめのホテルは？', '持ち物は？'];
        displayOptions(followupOptions, false);
        
    } catch (error) {
        console.error('Error:', error);
        hideTypingIndicator();
        displayBotMessage('申し訳ありません、サーバーとの通信中にエラーが発生しました。もう一度試してください。');
    }
}

// おすすめホテルを取得する関数
async function getRecommendedHotels() {
    showTypingIndicator();
    
    try {
        // APIにリクエストを送信
        const response = await fetch('/api/recommend-hotels', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mbtiType: chatState.mbtiType,
                destinationType: chatState.destinationType,
                budget: chatState.budget,
                duration: chatState.duration,
                season: chatState.season,
                companions: chatState.companions,
                travelStyle: chatState.travelStyle,
                interests: chatState.interests
            }),
        });
        
        // レスポンスをJSON形式で取得
        const data = await response.json();
        
        hideTypingIndicator();
        
        if (data.error) {
            displayBotMessage(`申し訳ありません、ホテル情報の取得中にエラーが発生しました: ${data.error}`);
            return;
        }
        
        if (!data.hotels || data.hotels.length === 0) {
            displayBotMessage('申し訳ありません、条件に合うホテルが見つかりませんでした。別の条件でお試しください。');
            return;
        }
        
        // ホテル情報をモーダルに表示
        const formattedContent = formatHotelRecommendations(data);
        modalContent.innerHTML = formattedContent;
        modal.style.display = 'block';
        
        // ボットメッセージでも簡単な情報を表示
        displayBotMessage(`${chatState.mbtiType}タイプのあなたにぴったりのホテルを見つけました！🏨 詳細を確認してみてください！`);
        
    } catch (error) {
        console.error('Error:', error);
        hideTypingIndicator();
        displayBotMessage('申し訳ありません、サーバーとの通信中にエラーが発生しました。');
    }
}

// 持ち物リストを取得する関数
async function getPackingList() {
    showTypingIndicator();
    
    try {
        // APIにリクエストを送信
        const response = await fetch('/api/packing-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mbtiType: chatState.mbtiType,
                destinationType: chatState.destinationType,
                budget: chatState.budget,
                duration: chatState.duration,
                season: chatState.season,
                companions: chatState.companions,
                travelStyle: chatState.travelStyle,
                interests: chatState.interests
            }),
        });
        
        const data = await response.json();
        hideTypingIndicator();
        
        if (data.error) {
            displayBotMessage('申し訳ありません、持ち物リストの取得中にエラーが発生しました。');
            return;
        }
        
        // 持ち物リストをモーダルに表示
        modalContent.innerHTML = formatPackingList(data.packingList);
        modal.style.display = 'block';
        
        // ボットメッセージでも簡単な情報を表示
        displayBotMessage(`${chatState.mbtiType}タイプのあなたの旅行に必要な持ち物リストを用意しました！🧳 詳細を確認してみてください！`);
        
    } catch (error) {
        console.error('Error:', error);
        hideTypingIndicator();
        displayBotMessage('申し訳ありません、サーバーとの通信中にエラーが発生しました。');
    }
}

// ホテル情報を整形する関数
function formatHotelRecommendations(data) {
    if (!data || !data.hotels || data.hotels.length === 0) {
        return '<p>申し訳ありません、ホテル情報が見つかりませんでした。</p>';
    }
    
    const hotels = data.hotels;
    
    let formattedHotels = `
    <div class="hotel-recommendations">
        <h2 class="section-heading">🏨 ${chatState.mbtiType}タイプにおすすめのホテル</h2>
        <p>${chatState.destinationType === '国内' ? 'あなたの旅行プランに合った素敵な宿泊先を見つけました！' : '海外での素敵な滞在先をピックアップしました！'}</p>
        <div class="hotels-container">
    `;
    
    hotels.forEach((hotel, index) => {
        // ウェブサイトURLの設定
        const encodedHotelName = encodeURIComponent(hotel.name);
        const encodedLocation = encodeURIComponent(hotel.location.split(' ')[0]);
        const websiteUrl = `https://www.google.com/search?q=${encodedHotelName}+${encodedLocation}+公式サイト`;
        
        formattedHotels += `
        <div class="hotel-card">
            <div class="hotel-info">
                <h3>${hotel.name}</h3>
                <div class="hotel-rating">
                    ${'★'.repeat(Math.floor(hotel.rating))}${hotel.rating % 1 >= 0.5 ? '☆' : ''}
                    <span class="rating-number">${hotel.rating}/5</span>
                </div>
                <p class="hotel-location">📍 ${hotel.location}</p>
                <p class="hotel-price">💰 1泊あたり: ${hotel.pricePerNight}</p>
                <p class="hotel-description">${hotel.description}</p>
                <div class="hotel-features">
                    ${hotel.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                <p class="mbti-match">✨ <strong>${chatState.mbtiType}との相性:</strong> ${hotel.mbtiMatch}</p>
                <a href="${websiteUrl}" target="_blank" rel="noopener noreferrer" class="hotel-website-button">公式サイトを見る</a>
            </div>
        </div>
        `;
    });
    
    formattedHotels += `
        </div>
        <div class="disclaimer">
            <p>※ 表示価格は時期により変動する場合があります。最新の情報は各ホテルの公式サイトでご確認ください。</p>
        </div>
    </div>
    `;
    
    return formattedHotels;
}

// 持ち物リストを整形する関数
function formatPackingList(packingList) {
    if (!packingList) {
        return '<p>申し訳ありません、持ち物リスト情報が見つかりませんでした。</p>';
    }
    
    let formattedList = `
    <div class="packing-list">
        <h2 class="section-heading">🧳 ${chatState.mbtiType}タイプのための持ち物リスト</h2>
        <p>${chatState.season}の${chatState.destinationType}旅行に最適な持ち物リストです。${chatState.mbtiType}タイプのあなたの特性に合わせた特別なアイテムも含まれています！</p>
    `;
    
    // カテゴリー別に分類
    Object.keys(packingList.categories).forEach(category => {
        const items = packingList.categories[category];
        
        formattedList += `
        <div class="packing-category">
            <h3>${getCategoryIcon(category)} ${category}</h3>
            <ul class="items-list">
        `;
        
        items.forEach(item => {
            // アフィリエイト商品の場合
            if (item.amazonUrl) {
                const affiliateLink = item.amazonUrl;
                
                formattedList += `
                <li class="affiliate-item">
                    <span class="item-name">${item.name}</span>
                    ${item.isRecommended ? '<span class="recommended-tag">おすすめ</span>' : ''}
                    <p class="item-description">${item.description}</p>
                    <a href="${affiliateLink}" target="_blank" class="amazon-button">
                        <img src="https://d1j8pt39hxlh3d.cloudfront.net/the_community/uploads/2022/06/amazon_PNG11-300x82-1.jpg" alt="Amazon" class="amazon-logo">
                        Amazonで見る
                    </a>
                </li>
                `;
            } else {
                // 通常アイテム
                formattedList += `
                <li>
                    <span class="item-name">${item.name}</span>
                    ${item.isRecommended ? '<span class="recommended-tag">おすすめ</span>' : ''}
                    ${item.description ? `<p class="item-description">${item.description}</p>` : ''}
                </li>
                `;
            }
        });
        
        formattedList += `
            </ul>
        </div>
        `;
    });
    
    // MBTIタイプ別特別アイテム
    if (packingList.mbtiSpecialItems && packingList.mbtiSpecialItems.length > 0) {
        formattedList += `
        <div class="packing-category mbti-special">
            <h3>✨ ${chatState.mbtiType}タイプに特におすすめのアイテム</h3>
            <ul class="items-list">
        `;
        
        packingList.mbtiSpecialItems.forEach(item => {
            if (item.amazonUrl) {
                const affiliateLink = item.amazonUrl;
                
                formattedList += `
                <li class="affiliate-item special-item">
                    <span class="item-name">${item.name}</span>
                    <span class="recommended-tag">特別おすすめ</span>
                    <p class="item-description">${item.description}</p>
                    <p class="mbti-reason">${item.mbtiReason}</p>
                    <a href="${affiliateLink}" target="_blank" class="amazon-button">
                    <img src="https://d1j8pt39hxlh3d.cloudfront.net/the_community/uploads/2022/06/amazon_PNG11-300x82-1.jpg" alt="Amazon" class="amazon-logo">
                    Amazonで見る
                </a>
            </li>
            `;
        } else {
            formattedList += `
            <li class="special-item">
                <span class="item-name">${item.name}</span>
                <span class="recommended-tag">特別おすすめ</span>
                <p class="item-description">${item.description}</p>
                <p class="mbti-reason">${item.mbtiReason}</p>
            </li>
            `;
        }
    });
    
    formattedList += `
        </ul>
    </div>
    `;
}

formattedList += `
    <div class="disclaimer">
        <p>※ 旅行の状況により、必要な持ち物は変わる場合があります。現地の天候や予定するアクティビティに応じて調整してください。</p>
    </div>
</div>
`;

return formattedList;
}

// カテゴリーアイコンを取得する関数
function getCategoryIcon(category) {
const icons = {
    '必須アイテム': '🔑',
    '衣類': '👕',
    '洗面用具': '🪥',
    '電子機器': '📱',
    '健康・医療': '💊',
    '書類・お金': '💳',
    'アクティビティ用品': '🏄‍♂️',
    'その他': '🔖'
};

return icons[category] || '📋';
}

// 旅行プラン結果を整形
function formatTravelPlanResult(text, imageKeyword) {
    if (!text) return '';

    // 1. 改行を保持
    let formatted = text;

    // 2. 数字+ドット+スペースで始まる行を見出しとして検出して強調
    formatted = formatted.replace(/([0-9]+)\.\s+([^\n]+)/g, '<strong>$1. $2</strong>');

    // 3. 絵文字を保持
    // 既に保持されているので特別な処理は不要

    // 4. 画像キーワードの部分を非表示にする
    formatted = formatted.replace(/画像キーワード:.*\n/g, '');

    // 5. 主な旅行先を抽出
    let destination = '';
    const destinationPattern = /主な旅行先:\s*([^\n]+)/;
    const destinationMatch = formatted.match(destinationPattern);
    if (destinationMatch && destinationMatch[1]) {
        destination = destinationMatch[1].trim();
    }

    // 6. destinations.jsの関数を使用して画像ファイル名を取得
    const imagePath = getDestinationImage(destination);

    // 7. 事前に用意した画像を表示するための処理
    const imageElement = `
    <div class="travel-image-container">
        <img src="/images/destinations/${imagePath}" 
             alt="${destination}" 
             class="travel-image"
             onerror="this.onerror=null; this.src='/images/destinations/default-destination.jpg';">
        <div class="image-caption">画像: ${destination}</div>
    </div>`;

    // 8. 「主な旅行先」の直後に画像を挿入
    if (destinationMatch) {
        const insertPosition = destinationMatch.index + destinationMatch[0].length;
        formatted = formatted.substring(0, insertPosition) + imageElement + formatted.substring(insertPosition);
    } else {
        // 見つからない場合は先頭に挿入
        formatted = imageElement + formatted;
    }

    // 以下は変更なし
    formatted = formatted.replace(/\n\n/g, '</p><p>');
    formatted = '<p>' + formatted + '</p>';
    formatted = formatted.replace(/<p><strong>/g, '<p class="section-heading"><strong>');
    formatted = formatted.replace(/・\s*([^\n]+)/g, '<li>$1</li>');
    formatted = formatted.replace(/<li>([^<]+)<\/li>/g, '<ul><li>$1</li></ul>');
    formatted = formatted.replace(/<\/ul>\s*<ul>/g, '');

    return formatted;
}

// ボットメッセージを表示
function displayBotMessage(message, scroll = true) {
const messageContainer = document.createElement('div');
messageContainer.className = 'message bot-message';

const botIcon = document.createElement('div');
botIcon.className = 'bot-icon';
const iconImg = document.createElement('img');
iconImg.src = '/images/travel-kun.png';
iconImg.alt = 'トラベルくん';
botIcon.appendChild(iconImg);

const messageContent = document.createElement('div');
messageContent.className = 'bot-message-content';

// 旅行プラン結果の場合は特別な処理
if (message.includes('旅行プラン') && message.length > 100) {
    messageContent.classList.add('travel-plan-result');
}

messageContent.innerHTML = message;

messageContainer.appendChild(botIcon);
messageContainer.appendChild(messageContent);

messagesContainer.appendChild(messageContainer);

if (scroll) {
    scrollToBottom();
}

// ボットメッセージも履歴に追加
chatState.messages.push({
    role: 'assistant',
    content: message
});
}

// ユーザーメッセージを表示
function displayUserMessage(message, scroll = true) {
const messageElement = document.createElement('div');
messageElement.className = 'message user-message';
messageElement.textContent = message;
messagesContainer.appendChild(messageElement);

if (scroll) {
    scrollToBottom();
}
}

// 選択肢ボタンを表示
function displayOptions(options, multiSelect = false, showBackButton = true) {
optionsContainer.innerHTML = '';

if (!options || options.length === 0) return;

// 戻るボタンを追加（最初のステップ以外）
if (showBackButton && chatState.step > 0) {
    const backButton = document.createElement('button');
    backButton.className = 'option-button back-button';
    backButton.textContent = '← 戻る';
    backButton.style.backgroundColor = '#f2f2f2';
    backButton.style.color = '#666';
    backButton.style.borderColor = '#ddd';
    backButton.addEventListener('click', function() {
        displayUserMessage('← 戻る');
        saveUserMessage('← 戻る'); // goToPreviousStep() が呼ばれる
    });
    optionsContainer.appendChild(backButton);
}

options.forEach(option => {
    const button = document.createElement('button');
    button.className = 'option-button';
    button.textContent = option;
    button.addEventListener('click', function() {
        // 選択したオプションをユーザーメッセージとして表示
        displayUserMessage(option);
        
        // オプション特有の処理
        if (option === '旅行案を見る') {
            // モーダルを表示
            modal.style.display = 'block';
            return;
        } else if (option === 'おすすめのホテルは？') {
            // ホテル情報を取得して表示
            getRecommendedHotels();
            return;
        } else if (option === '持ち物は？') {
            // 持ち物リストを取得して表示
            getPackingList();
            return;
        }
        
        if (multiSelect) {
            // 複数選択の場合は選択肢を残す
            saveUserMessage(option);
            button.disabled = true;
            button.style.backgroundColor = '#d1e7ff';
            button.style.borderColor = '#2575fc';
            
            // 完了ボタンがなければ追加
            if (!document.getElementById('complete-button')) {
                const completeButton = document.createElement('button');
                completeButton.id = 'complete-button';
                completeButton.className = 'option-button';
                completeButton.style.backgroundColor = '#2575fc';
                completeButton.style.color = 'white';
                completeButton.textContent = '選択完了';
                completeButton.addEventListener('click', function() {
                    // 選択完了メッセージ
                    displayUserMessage('選択完了');
                    optionsContainer.innerHTML = '';
                    
                    // 次のステップへ
                    chatState.step++;
                    displayNextBotMessage();
                });
                optionsContainer.appendChild(completeButton);
            }
        } else {
            // 単一選択の場合は選択肢を非表示にして次へ
            optionsContainer.innerHTML = '';
            saveUserMessage(option);
            processUserInput(option);
        }
    });
    optionsContainer.appendChild(button);
});

scrollToBottom();
}

// タイピングインジケーターを表示
function showTypingIndicator() {
hideTypingIndicator(); // 既存のものを削除

const typingElement = document.createElement('div');
typingElement.className = 'typing-indicator';
typingElement.id = 'typing-indicator';

for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.className = 'typing-dot';
    typingElement.appendChild(dot);
}

messagesContainer.appendChild(typingElement);
scrollToBottom();
}

// タイピングインジケーターを非表示
function hideTypingIndicator() {
const typingElement = document.getElementById('typing-indicator');
if (typingElement) {
    typingElement.remove();
}
}

// スクロールを最下部に
function scrollToBottom() {
messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 日付をYYYY-MM-DD形式で取得する関数
function getFormattedDate(daysFromNow) {
const date = new Date();
date.setDate(date.getDate() + daysFromNow);
return date.toISOString().split('T')[0];
}

// 日付を日本語形式（例：2025年5月1日）に変換する関数
function formatJapaneseDate(dateString) {
const date = new Date(dateString);
const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();
return `${year}年${month}月${day}日`;
}