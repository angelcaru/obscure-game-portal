class Board {
    possibleUniqueMoves(turn) {
        return this.possibleMoves(turn);
    }

    winner() {
        return -1;
    }

    isDrawn() {
        return false;
    }

    evaluateHeuristic() {
        return 0;
    }

    makeAiMove(turn) {
        let bestMoves = [];
        let bestScore = -Infinity;
        const moves = this.possibleUniqueMoves(turn);
        for (const move of moves) {
            const newBoard = this.copy();
            newBoard.performMove(move);

            const score = -newBoard.evaluate(1-turn);
            if (score > bestScore) {
                bestScore = score;
                bestMoves = [move];
            } else if (score === bestScore) {
                bestMoves.push(move);
            }
        }

        this.performMove(random(bestMoves));
    }

    evaluate(turn, depth) {
        if (depth === undefined) depth = this.constructor.MINIMAX_DEPTH;

        if (this.winner() === turn) return Infinity;
        if (this.winner() === 1 - turn) return -Infinity;
        if (this.isDrawn()) return 0;

        if (depth === 0) return this.evaluateHeuristic(turn);

        let bestScore = -Infinity;
        const moves = this.possibleUniqueMoves(turn);
        for (const move of moves) {
            const newBoard = this.copy();
            newBoard.performMove(move);

            const score = -newBoard.evaluate(1-turn, depth-1);
            if (score > bestScore) bestScore = score;
        }

        return bestScore;
    }
}