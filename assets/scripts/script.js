
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const apiUrl = 'https://quizapi.io/api/v1/questions?'
const header = {
    headers: {
        'X-Api-Key': 'Rj9RifENA0BXm77bSlQKgpNvKiIU9sFvU8JtGsly',
    }
}
// const newParams = new URLSearchParams({
//     tags: 'Html',
//     difficulty: 'easy',
//     limit: 5,
//     "multiple_correct_answers": "false",
// })
async function callApi(apiUrl, newParams, header, callback) {
    await fetch(apiUrl + newParams, header)
        .then(response => response.json())
        .then(callback)
}

function getQuestions(tag) {
    const newParams = new URLSearchParams({
        tags: tag,
        difficulty: 'easy',
        limit: 5,
        "multiple_correct_answers": "false",
    })
    callApi(apiUrl, newParams, header, function (response) {
        renderQuestion(response)
    })
}

function renderQuestion(response) {
    const answer = response.map(function (element, index) {
        const question = element.question.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const answer_a = element.answers.answer_a?.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const answer_b = element.answers.answer_b?.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const answer_c = element.answers.answer_c?.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const answer_d = element.answers.answer_d?.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const a = `<input type="button" value='${answer_a}' data-correct="${element.correct_answers.answer_a_correct}" class="answer" />`;
        const b = `<input type="button" value='${answer_b}' data-correct="${element.correct_answers.answer_b_correct}" class="answer" />`;
        const c = `<input type="button" value='${answer_c}' data-correct="${element.correct_answers.answer_c_correct}" class="answer" />`;
        const d = ` <input type="button" value='${answer_d}' data-correct="${element.correct_answers.answer_d_correct}" class="answer" />`;
        const arr = [];
        if (answer_a !== undefined) {
            arr.push(a);
        }
        if (answer_b !== undefined) {
            arr.push(b);
        }
        if (answer_c !== undefined) {
            arr.push(c);
        }
        if (answer_d !== undefined) {
            arr.push(d);
        }
        const getShuffledArr = arr => {
            const newArr = arr.slice()
            for (let i = newArr.length - 1; i > 0; i--) {
                const rand = Math.floor(Math.random() * (i + 1));
                [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
            }
            return newArr
        };

        const shuffledArr = getShuffledArr(arr);
        return {
            index: index,
            html: ` <div data-index="${index}"  class="questions">
                        <div class="question" >
                            <h3>${question}</h3>
                        </div>
                        <div class="answers">
                            ${shuffledArr.join("")}
                        </div>
                    </div>`
        }

    });
    $('.box-question').innerHTML = "";

    for (let key = 0; key < answer.length; key++) {
        $('.box-question').innerHTML += answer[key].html;
    }

    $('.questions[data-index="0"]').classList.add('after');

    selectAnswer();
}


function selectAnswer() {
    let dataIndex = 0;
    let heart = -1;
    let score = 0;

    $$('input.answer').forEach((element, index) => {
        element.onclick = function (e) {
            if (this.dataset.correct === 'true') {
                this.classList.add('correct');
                score++;
                setTimeout(() => {
                    $(`.questions[data-index="${dataIndex}"]`).classList.add('before');
                    dataIndex++;
                    dataIndex == 5 ? dataIndex = 0 : '';
                    dataIndex == 0 ? screenScore(score) : '';
                    $('#progress').value = dataIndex + 1;
                    $(`.questions[data-index="${dataIndex}"]`).classList.add('after');
                }, 500)
            } else {
                this.classList.add('wrong');
                heart++;
                $$('.heart i')[heart].classList.add('hidden');
            }
            if (heart === 2) {
                $$('.heart i')[0].classList.remove('hidden');
                $$('.heart i')[1].classList.remove('hidden');
                $$('.heart i')[2].classList.remove('hidden');
                screenScore(score);
            }
        }
    })
}

function screenScore(score) {
    $('.app-questions').classList.toggle('open');
    $('.app-congratulations').classList.toggle('open');
    $('.score h1').innerHTML = score + " score";
}

$$('.select-tag').forEach((element, index) => {
    $('.close').addEventListener('click', function () {
        $('.screen').classList.add('hidden')
    })
    element.onclick = function () {
        $('.screen').innerHTML = "Loading...";
        getQuestions(this.innerHTML);
        $('.score').innerHTML = 0;
        $('.heart').innerHTML = 3;
        $('.screen').classList.remove('hidden')
    }
});

$$('.app-body section').forEach((element, index) => {
    element.onclick = function () {


        $('.box-question').innerHTML = '<div class="loader"></div>';
        $('#progress').value = 1;

        getQuestions(this.getAttribute('id'));

        $('.app-container').classList.toggle('open');
        $('.app-questions').classList.toggle('open');
    }
})

$('.back').onclick = function () {
    $('.app-container').classList.toggle('open');
    $('.app-questions').classList.toggle('open');
}

$('.back-home').onclick = function () {
    $('.app-congratulations').classList.toggle('open');
    $('.app-container').classList.toggle('open');
}