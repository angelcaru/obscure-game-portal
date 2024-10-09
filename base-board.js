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

            const score = newBoard.evaluate(1-turn, this.constructor.MINIMAX_DEPTH, false);
            if (score > bestScore) {
                bestScore = score;
                bestMoves = [move];
            } else if (score === bestScore) {
                bestMoves.push(move);
            }
        }

        this.performMove(random(bestMoves));
    }

    evaluate(turn, depth, maximizingPlayer = true, alpha = -Infinity, beta = Infinity) {
        if (depth === undefined) depth = this.constructor.MINIMAX_DEPTH;

        if (this.winner() === turn) return maximizingPlayer ? Infinity : -Infinity;
        if (this.winner() === 1 - turn) return maximizingPlayer ? -Infinity : Infinity;
        if (this.isDrawn()) return 0;

        if (depth === 0) return this.evaluateHeuristic(turn);

        const cond = maximizingPlayer ? (a, b) => a > b : (a, b) => a < b;
        const breakCond = maximizingPlayer ? val => val > beta : val => val < alpha;

        let bestScore = maximizingPlayer ? -Infinity : Infinity;
        const moves = this.possibleUniqueMoves(turn);
        for (const move of moves) {
            const newBoard = this.copy();
            newBoard.performMove(move);

            const score = newBoard.evaluate(1-turn, depth-1, !maximizingPlayer, alpha, beta);
            if (cond(score, bestScore)) bestScore = score;
            if (breakCond(score)) break;

            if (maximizingPlayer) {
                alpha = Math.max(alpha, score);
            } else {
                beta = Math.min(beta, score);
            }
        }

        return bestScore;
    }
}