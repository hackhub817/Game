const Rule = () => {
  return (
    <>
      <h1 className="text-white text-center font-semibold text-3xl">Rules</h1>
      <div className="px-6 text-white text-xl ">
        <ul>
          <li className="py-2">
            The main objective of the game is to defeat the computer in a
            10-round Rock, Paper, Scissors game.
          </li>
          <li className="py-2">
            You will be given to select three choices that is rock, paper and
            scissor.
          </li>
          <li className="py-5">
            Your choices will decide win or lose :
            <ul className="text-red-500 list-disc px-5">
              <li>Rock beats Scissors.</li>
              <li>Scissors beats Paper. </li>
              <li>Paper beats Rock.</li>
              <li>If both you and the computer choose the same, it's a tie.</li>
            </ul>{" "}
            Select your choice, and the computer will pick one randomly. The
            winner is decided based on the rules.
          </li>
          <li className="py-2">
            Your Scoring will be 10 points for each win. High scores are saved
            if they surpass previous ones.
          </li>
          <li className="py-2">
            There will be 10 rounds, after which you can reset and play again.
          </li>
          <li className="py-2">
            {" "}
            You can reset the game to start over at any time.
          </li>
          <li className="py-2">
            You can even check the LeaderBoard to check your rank
          </li>
        </ul>
      </div>
    </>
  );
};
export default Rule;
