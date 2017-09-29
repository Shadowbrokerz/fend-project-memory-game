const cardList = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
const openCards = [];
let moves = 0;
let timerInterval;

function timer() {
///////////////Timer///////////////////////////
    let minutes = `00`;
    let seconds = `00`;
    timerInterval = setInterval(function () {
        let matchCounter = $('.match').length;
        if (matchCounter === 16) {
            clearInterval(timerInterval);
        }
        seconds++;
        if (seconds < 10) {
            seconds = `0${seconds}`;
        }
        if (seconds > 59) {
            minutes++;
            if (minutes < 10) {
                minutes = `0${minutes}`;
            }
            seconds = `00`;
        }


        $('.timer').text(`${minutes}:${seconds}`);

    }, 1000);
///////////////////////////////////////////////////
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function buildCards() {
    for (let round = 0; round < 2; round++) {
        const mixedArray = shuffle(cardList);
        mixedArray.forEach(function (card) {
            $('.deck').append(` <li class="card">
                <i class="fa ${card}" data-name="${card}"></i>
            </li>`);
        });
    }
}

function starRating(moves) {
    if (moves === 9) {
        $('.three').css('color', 'black');
    }
    else if (moves >= 15) {
        $('.two').css('color', 'black');
    }

}


function cardCheck(card, array) {
    // Comparing the 2 opened cards
    if (array.length >= 2) {
        moves++;
        starRating(moves);
        $('.moves').text(moves);
        //disable clicks if it's more than 2 active.
        $('.card').off();
        if (card === array[0]) {
            //Card Match!
            $(`.${card}`).parent().addClass('match').removeClass('active');
            array.length = 0;
            //Checks for Game over
            gameOver();
            //Reset click events
            $('.card').off();
            enableClick();
        } else {
            //No match
            array.forEach(function(){
                $('.active').addClass('mismatch');
            });
            setTimeout(function () {
                for (item in array) {
                    $(`.${array[item]}`).parent().removeClass('open show mismatch active');
                }
                array.length = 0;
                //Reset Click events
                $('.card').off();
                enableClick();
            }, 500);

        }
    }
}

function enableClick() {
    $('.card').on('click', function () {
        $(this).addClass('open show active');
        //Avoid clicking it again to find the same card.
        $(this).off();
        const card = $(this).children().attr('data-name');
        openCards.push(card);
        cardCheck(card, openCards);
    });
}

function gameOver() {
    let matchCounter = $('.match').length;
    if (matchCounter === 16) {
        if (moves <= 9) {
            congrats = 'Amazing!';
        }
        else if (moves > 15) {
            congrats = 'You can do better than this...';
        }
        else {
            congrats = 'Good job, you almost got it!';
        }
        $('.container').append(`
            <div class="game-over">
                <div class="game-over-text">
                    <h2>${congrats}</h2>
                    <h3>You finished the game with ${moves} moves.</h3>
                </div>
            </div>`
        );
        $('.game-over').append(
            `<div class="final-game">${$('.stars').html()}</div>
            <div class="final-game">${$('.timer').html()}</div>
            <div class="final-game">${$('.restart').html()}</div>`
        );
        setTimeout(function () {
            $('.final-game').addClass('active');
        }, 1500);
        $(' .board ,.deck, .score-panel').addClass('finished');
    }
}

function newGame() {
    //Restart moves,timer,reset modals,stars,rebuild the cards.
    moves = 0;
    clearInterval(timerInterval);
    timer();
    $('.game-over').remove();
    $('.deck').children().remove();
    $('.board, .deck, .score-panel').removeClass('finished');
    $('.fa-star').css('color', 'gold');
    buildCards();
    enableClick();
    $('.moves').text(moves);
    $('.timer').text('00:00');
}

//Init
newGame();
