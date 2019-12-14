### 题目描述
某天，Lostmonkey发明了一种超级弹力装置，为了在他的绵羊朋友面前显摆，他邀请小绵羊一起玩个游戏。游戏一开始，Lostmonkey在地上沿着一条直线摆上n个装置，每个装置设定初始弹力系数ki，当绵羊达到第i个装置时，它会往后弹ki步，达到第i+ki个装置，若不存在第i+ki个装置，则绵羊被弹飞。绵羊想知道当它从第i个装置起步时，被弹几次后会被弹飞。为了使得游戏更有趣，Lostmonkey可以修改某个弹力装置的弹力系数，任何时候弹力系数均为正整数。
### 思路
经典分块问题。

### 代码实现
```c++
#include <iostream>
#include <cstdio>
#include <cmath>

const size_t max_count = 200005, max_sqrt = 1005;
static size_t block_size = 1;

int cof[max_count], blck[max_count], left[max_sqrt], right[max_sqrt], table[max_count], jmp[max_count];

int calc(const int& pos) {
	int res = 0;
	for (int i = pos; i != 0; i = jmp[i]) {
		res += table[i];
	}

	return res;
}

int main() {
	int count;
	scanf("%d", &count);
	block_size = sqrt(count);

	for (int i = 1; i <= count; i++) {
		std::cin >> cof[i];
		blck[i] = (i - 1) / block_size + 1;
	}

	int block_count = ceil(count / block_size);
	for (int i = 1; i <= block_count; i++) {
		left[i] = (i - 1) * block_size + 1;
		right[i] = i * block_size;
	}
	right[block_count] = count;

	for (int i = count; i > 0; i--) {
		if (i + cof[i] > count) {
			table[i] = 1;
		}
		else if (blck[i] == blck[i + cof[i]]) {
			table[i] = table[i + cof[i]] + 1;
			jmp[i] = jmp[i + cof[i]];
		}
		else {
			table[i] = 1;
			jmp[i] = i + cof[i];
		}
	}

	int op_count;
	scanf("%d", &op_count);

	for (int i = 0; i < op_count; i++) {
		int oprand;
		scanf("%d", &oprand);

		if (oprand == 1) {
			int pos;
			scanf("%d", &pos);
			printf("%d\n", calc(pos + 1));
		}
		else {
			int pos, val;
			scanf("%d%d", &pos, &val);

			cof[pos + 1] = val;
			for (int j = pos + 1; j >= left[blck[pos + 1]]; j--) {
				if (blck[j] == blck[j + cof[j]]) {
					table[j] = table[j + cof[j]] + 1;
					jmp[j] = jmp[j + cof[j]];
				}
				else {
					table[j] = 1;
					jmp[j] = j + cof[j];
				}
			}
		}
	}

	return 0;
}
```