---
title: Acesrc and Travel
date: 2019-08-15 14:43:39
tags:
    - 动态规划
    - 树形DP
---
### 题目描述
{% blockquote %}
Acesrc is a famous tourist at Nanjing University second to none. During this summer holiday, he, along with Zhang and Liu, is going to travel to Hong Kong. There are n spots in Hong Kong, and n−1 bidirectional sightseeing bus routes connecting these spots. They decide to visit some spots by bus. 

However, Zhang and Liu have different preferences for these spots. They respectively set a satisfactory value for each spot. If they visit the ith spot, Zhang will obtain satisfactory value $$a_i$$, and Liu will obtain $$b_i$$. Starting with Zhang, they alternately decide the next spot to visit for the sake of fairness. There must be a bus route between the current spot and the next spot to visit. Moreover, they would never like to visit a spot twice. If anyone can't find such a next spot to visit, they have no choice but to end this travel. 

Zhang and Liu are both super smart competitive programmers. Either want to maximize the difference between his total satisfactory value and the other's. Now Acesrc wonders, if they both choose optimally, what is the difference between total satisfactory values of Zhang and Liu?
{% endblockquote %}
<!-- more -->
### 思路
+ 不妨以1为根节点，处理出每个节点向下的所有路径和路径结果，并且排序；
+ 选择某一个节点为起点，考虑所有的可选路径（包括向下的和回溯的），从所有路径中分别选出最大值（先手）和最小值（后手）；
+ 从所有结果中挑选最大值

### 代码实现
```c++
#include <iostream>
#include <cstdio>
#include <vector>
#include <algorithm>
#include <set>

typedef long long lint;
typedef std::pair<lint, lint> llpair;
typedef std::pair<lint, int> lipair;

const size_t max_count = 100001;
const lint inf = 0x3f3f3f3f3f3f3f3f, ninf = 0xafafafafafafafaf;

std::vector<int> tree[max_count];
std::vector<lipair> edges[max_count][2];
llpair trace[max_count];
lint dp[max_count][2], sub[max_count];
int previous[max_count];

bool visit[max_count];

void traceback(const int& cur) {
	visit[cur] = true;

	if (previous[cur] == -1) {
		return;
	}

	int pre = previous[cur];
	if (!visit[pre]) {
		traceback(pre);
	}

	if (edges[pre][0].size() == 1) {
		if (previous[pre] == -1) {
			trace[cur].first = trace[cur].second = sub[pre];
			return;
		}

		trace[cur].first = trace[pre].second + sub[pre];
		trace[cur].second = trace[pre].first + sub[pre];

		return;
	}

	int min = (edges[pre][0][0].second == cur) ? 1 : 0;
	int max = (edges[pre][1].rbegin()->second == cur) ? edges[pre][1].size() - 2 : edges[pre][1].size() - 1;

	if (previous[pre] == -1) {
		trace[cur].first = edges[pre][1][max].first + sub[pre];
		trace[cur].second = edges[pre][0][min].first + sub[pre];
	}
	else {
		trace[cur].first = std::max(trace[pre].second, edges[pre][1][max].first) + sub[pre];
		trace[cur].second = std::min(trace[pre].first, edges[pre][0][min].first) + sub[pre];
	}
}

void dfs(const int& pre, const int& cur) {
	int size = tree[cur].size();

	if (size == 1 && pre != -1) {
		dp[cur][0] = dp[cur][1] = sub[cur];
		return;
	}

	for (int i = 0; i < size; i++) {
		int next = tree[cur][i];
		if (next == pre) {
			continue;
		}

		if (dp[next][0] == ninf) {
			previous[next] = cur;
			dfs(cur, next);
		}
		dp[cur][1] = std::min(dp[cur][1], dp[next][0] + sub[cur]);

		if (dp[next][1] == inf) {
			previous[next] = cur;
			dfs(cur, next);
		}

		dp[cur][0] = std::max(dp[cur][0], dp[next][1] + sub[cur]);

		edges[cur][0].push_back(lipair(dp[next][0], next));
		edges[cur][1].push_back(lipair(dp[next][1], next));
	}

	std::sort(edges[cur][0].begin(), edges[cur][0].end());
	std::sort(edges[cur][1].begin(), edges[cur][1].end());
}

void run() {
	int count;
	std::cin >> count;

	for (int i = 1; i <= count; i++) {
		visit[i] = false;
		tree[i].clear();
		edges[i][0].clear();
		edges[i][1].clear();
		dp[i][0] = ninf, dp[i][1] = inf;
		previous[i] = 0;

		std::cin >> sub[i];
	}
	for (int i = 1; i <= count; i++) {
		lint t;
		std::cin >> t;
		sub[i] -= t;
	}

	for (int i = 0; i < count - 1; i++) {
		int x, y;
		std::cin >> x >> y;
		tree[x].push_back(y);
		tree[y].push_back(x);
	}

	if (count == 1) {
		std::cout << sub[1] << std::endl;
		return;
	}

	previous[1] = -1;
	dfs(-1, 1);

	for (int i = 1; i <= count; i++) {
		traceback(i);
	}

	lint res = ninf;
	for (int i = 1; i <= count; i++) {
		if (i == 1) {
			res = std::max(res, dp[i][1]);
		}
		else if (tree[i].size() == 1) {
			res = std::max(res, sub[i] + trace[i].first);
		}
		else {
			res = std::max(res, std::min(sub[i] + trace[i].first, dp[i][1]));
		}
	}

	std::cout << res << std::endl;
}

int main() {
	std::ios::sync_with_stdio(false);
	std::cin.tie(0); std::cout.tie(0);

	int count;
	std::cin >> count;

	for (int i = 0; i < count; i++) {
		run();
	}

	return 0;
}
```