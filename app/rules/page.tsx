"use client";
import { title } from "@/components/primitives";
import styles from "./rules.module.css";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function DocsPage() {
  const { theme, setTheme } = useTheme();
  const style = theme == "light" ? {
    title: styles.title,
    text: styles.text,
    subtitle: styles.subtitle,
    subSubtitle: styles.subSubtitle,
    listItem: styles.listItem,
    list: styles.list,
  } : {
    title: styles.darkTitle,
    text: styles.darkText,
    subtitle: styles.darkSubtitle,
    subSubtitle: styles.darkSubSubtitle,
    list: styles.list,
    listItem: styles.darkListItem,
  };

  return (
    <div className="flex flex-col gap-5 text-left">

      <Link href={"/"} className="text-primary">Go Home</Link>
      <h1 className={style.title}>Coup Manual</h1>
      <p className={style.text}>
        In the not too distant future, the government is run for profit by a new
        “royal class” of multinational CEOs. Their greed and absolute control of
        the economy has reduced all but a privileged few to lives of poverty and
        desperation. Out of the oppressed masses rose The Resistance, an underground
        organization focused on overthrowing these powerful rulers. The valiant
        efforts of The Resistance have created discord, intrigue and weakness in the
        political courts of the noveau royal, bringing the government to brink of
        collapse. But for you, a powerful government official, this is your opportunity
        to manipulate, bribe and bluff your way into absolute power. To be successful,
        you must destroy the influence of your rivals and drive them into exile.
        In these turbulent times there is only room for one to survive.

      </p>

      <h1 className={style.title}>
        Contents
      </h1>
      <ul className={style.list}>
        <li className={style.listItem}>
          25 character cards

        </li>
        <li className={style.listItem}>
          5 each of Duke, Assassin, Captain, Ambassador, Contessa

        </li>
        <li className={style.listItem}>

          6 summary cards
        </li>
        <li className={style.listItem}>
          50 coins

        </li>
      </ul>
      <h1 className={style.title}>

        Rules
      </h1>
      <h2 className={style.subtitle}>
        Set-Up
      </h2>
      <p className={style.text}>
        Shuffle all the character cards and deal 2 to each player. Players can
        always look at their cards but must keep them face down in front of
        them. Place the remaining cards in the middle of the play area as the
        Court deck.
        Give each player 2 coins. Each player’s money must be kept visible.
        Place the remaining coins in the middle of the play area as the Treasury.
        Give one summary card to each player. This is for reference only.
        Players should familiarize themselves with all the actions and characters
        before starting the game.
        The person who won the last game starts.

      </p>
      <h2 className={style.subtitle}>
        Goal
      </h2>
      <p className={style.text}>
        To eliminate the influence of all other players and be the last survivor.
      </p>
      <h2 className={style.subtitle}>
        Influence
      </h2>
      <p className={style.text}>
        Face down cards in front of a player represent who they influence
        at court. The characters printed on their face down cards represents
        which characters that player influences and their abilities.
        Every time a player loses an influence they have to turn over and
        reveal one of their face down cards. Revealed cards remain face up in
        front of the player visible to everyone and no longer provide influence
        for the player. Each player always chooses which of their own cards
        they wish to reveal when they lose an influence.
        When a player has lost all their influence they are exiled
        and out of the game.
      </p>
      <h2 className={style.subtitle}>
        Game Play
      </h2>
      <p className={style.text}>
        The game is played in turns in clockwise order (In this case, in the joining room order).
        Each turn a player chooses one action only. A player may not pass.
        After the action is chosen other players have an opportunity to
        challenge or counteract that action.
        If an action is not challenged or counteracted, the action
        automatically succeeds.
        Challenges are resolved first before any action or
        counteraction is resolved.
        When a player has lost all their influence and both their cards are
        face up in front of them, they are immediately out of the game.
        They leave their cards face up and return all their coins to the Treasury.
        The game ends when there is only one player left.
      </p>

      <h2 className={style.subtitle}>
        Actions
      </h2>
      <p className={style.text}>
        A player may choose any action they want and can afford.
        Some actions (Character Actions) require influencing characters.
        If they choose a Character Action a player must claim that the
        required character is one of their face down cards. They can be
        telling the truth or bluffing. They do not need to reveal any of their
        face down cards unless they are challenged. If they are not challenged
        they automatically succeed.
        If a player starts their turn with 10 (or more) coins they must launch a
        Coup that turn as their only action.
      </p>

      <h1 className={style.title}>
        General Actions
      </h1>
      <h2 className={style.subtitle}>
        Always available
      </h2>
      <ul className={style.list}>
        <li className={style.listItem}>
          Income
          Take 1 coin from the Treasury
        </li>
        <li className={style.listItem}>
          Foreign Aid
          Take 2 coins from the Treasury. (Can be blocked by the Duke)
        </li>
        <li className={style.listItem}>
          Coup
          Pay 7 coins to the Treasury and launch a Coup against another
          player. That player immediately loses an influence. A Coup is always
          successful. If you start your turn with 10 (or more) coins you are
          required to launch a Coup.
        </li>
      </ul>

      <h2 className={style.subtitle}>
        Character Actions
      </h2>
      <p className={style.text}>
        (If challenged a player must show they influence the relevant character)
      </p>

      <h3 className={style.subSubtitle}>
        Duke – Tax
      </h3>
      <p className={style.text}>
        Take 3 coins from the Treasury.
      </p>
      <h3 className={style.subSubtitle}>
        Assassin – Assassinate

      </h3>
      <p className={style.text}>
        Pay 3 coins to the Treasury and launch an
        assassination against another player. If successful
        that player immediately loses an influence.
        (Can be blocked by the Contessa)
      </p>

      <h3 className={style.subSubtitle}>
        Captain – Steal
      </h3>
      <p className={style.text}>
        Take 2 coins from another player. If they only have
        one coin, take only one. (Can be blocked by the
        Ambassador or the Captain)
      </p>


      <h3 className={style.subSubtitle}>
        Ambassador – Exchange

      </h3>
      <p className={style.text}>
        Exchange cards with the Court. First take 2 random
        cards from the Court deck. Choose which, if any, to
        exchange with your face down cards. Then return two
        cards to the Court deck.
      </p>

      <h2 className={style.subtitle}>
        Counteractions
      </h2>
      <p className={style.text}>
        Counteractions can be taken by other players to intervene or block a player’s action.
        Counteractions operate like character actions. Players may claim to
        influence any of the characters and use their abilities to counteract
        another player. They may be telling the truth or bluffing. They do
        not need to show any cards unless challenged. Counteractions may be
        challenged, but if not challenged they automatically succeed. If an
        action is successfully counteracted, the action fails but any coins paid as
        the cost of the action remain spent.
      </p>

      <h3 className={style.subSubtitle}>
        Duke – Blocks Foreign Aid

      </h3>
      <p className={style.text}>
        Any player claiming the Duke may counteract and
        block a player attempting to collect foreign aid.
        The player trying to gain foreign aid receives
        no coins that turn.

      </p>

      <h3 className={style.subSubtitle}>
        Contessa – Blocks Assassination
      </h3>
      <p className={style.text}>
        The player who is being assassinated may claim the
        Contessa and counteract to block the assassination.
        The assassination fails but the fee paid by the player for
        the assassin remains spent.
      </p>

      <h3 className={style.subSubtitle}>
        Ambassador/Captain – Blocks Stealing
      </h3>
      <p className={style.text}>
        The player who is being stolen from may claim either
        the Ambassador or the Captain and counteract to
        block the steal. The player trying to steal receives no
        coins that turn.
      </p>

      <h1 className={style.title}>
        Challenges
      </h1>

      <p className={style.text}>

        Any action or counteraction using character influence
        can be challenged.
        Any other player can issue a challenge to a player regardless of whether
        they are the involved in the action.
        Once an action or counteraction is declared other players must be given
        an opportunity to challenge. Once play continues challenges cannot be
        retro-actively issued.
        If a player is challenged they must prove they had the required
        influence by showing the relevant character is one of their face down
        cards. If they can’t, or do not wish to, prove it, they lose the challenge.
        If they can, the challenger loses.
        Whoever loses the challenge immediately loses an influence.
        If a player wins a challenge by showing the relevant character card, they
        first return that card to the Court deck, re-shuffle the Court deck and
        take a random replacement card. (That way they have not lost an influence
        and other players do not know the new influence card they have). Then the
        action or counteraction is resolved.
        If an action is successfully challenged the entire action fails, and any
        coins paid as the cost of the action are returned to the player.
      </p>

      <h1 className={style.title}>
        Example Play
      </h1>

      <p className={style.text}>

        3 players. Each start with 2 influence cards and 2 coins. The
        remaining 9 character cards make up the Court deck.
        Natasha has been dealt the Contessa and Duke. She starts and on
        her first turn she claims she has the Duke and takes 3 coins. No
        one challenges her. She now has 5 coins.
        Sacha has the Captain and the Contessa. But on his turn he bluffs
        and claims to have the Ambassador. No one challenges him so
        he takes two new cards from the Court deck. An Assassin and a
        Duke. He keeps the Assassin and his original Captain and returns
        the Duke and Contessa to the Court. He still has 2 coins.
        Haig has been dealt an Assassin and a Duke. On his first turn he
        claims the Duke and takes 3 coins. Sacha thinks Haig is bluffing
        and challenges him. Haig shows a Duke and wins the challenge.
        Haig keeps the 3 coins that the Duke provided him but has to
        return his Duke card to the Court. He shuffles the Court deck
        and takes a new random card, a Contessa. Sacha lost the challenge
        and has to lose an influence. He chooses to lose his Assassin, turns
        it over and leaves it face up in front of him.
        After the first turn:
        Natasha has 2 influence remaining (Contessa and Duke) and 5 coins
        Sacha has 1 influence remaining (Captain) and 2 coins.
        Haig has 2 influence remaining (Assassin and Contessa) and 5 coins One
        Assassin has been revealed and is face up on the table.
        Continuing on...
        Natasha continues to claim the Duke. She takes 3 coins, no one
        challenges her. She now has 8 coins.
        Sacha just takes Income of 1 coin. He does not have to claim to
        influence any characters and no one can block it.
        He now has 3 coins.
        Haig claims the Assassin, pays 3 coins to the Treasury and
        attempts to assassinate Natasha. No one challenges his Assassin,
        but Natasha claims to have the Contessa that blocks the
        Assassin. No one challenges her so the assassination fails. The 3
        coins remain spent so Haig has now 2 coins.
        Natasha now spends 7 coins to launch a Coup against Haig. A
        Coup cannot be blocked. Haig loses an influence and chooses
        to turn over his Contessa. Natasha has 1 coin remaining.
        Sacha claims the Captain to take 2 coins from Haig. No
        one challenges Sacha’s Captain but Haig claims to have
        an Ambassador that blocks the Captain. Sacha chooses to
        challenge. Haig cannot show an Ambassador and loses his last
        influence, turning over his Assassin. Sacha receives his 2 coins
        from the Captain’s successful steal and now has 5 coins.
        At this stage
        Natasha has 2 influence remaining (Contessa and Duke) and 1 coin.
        Sacha has 1 influence remaining (Captain) and 5 coins.
        Haig is out of the game.
        Two Assassins and One Contessa have been revealed and are
        face up on the table.
        Play continues...
        Note: Double Dangers of Assasination
        It is possible to lose 2 influence in one turn if you unsuccessfully defend against an
        assassination. For example, if you challenge an assassin used against you and lose
        the challenge, you will lose 1 influence for the lost challenge and then 1 influence
        for the successful assassination. Or if you bluff about having the Contessa to block
        an assassination attempt and are challenged, you will lose 1 influence for the lost
        challenge and then lose 1 influence for the successful assassination.
      </p>

    </div>
  );
}
