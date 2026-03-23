# Go 项目 Makefile
# 选手需完善构建目标并配置 CI/CD

.PHONY: build test lint deploy clean

# 项目信息
APP_NAME := myapp
VERSION := $(shell git describe --tags --always 2>/dev/null || echo "dev")
BUILD_TIME := $(shell date +%Y%m%d-%H%M%S)
LDFLAGS := -ldflags "-X main.Version=${VERSION} -X main.BuildTime=${BUILD_TIME}"

# 构建
build:
	@echo "🔨 构建 ${APP_NAME}..."
	go build ${LDFLAGS} -o bin/${APP_NAME} ./cmd/main.go
	@echo "✅ 构建完成: bin/${APP_NAME}"

# 测试
test:
	@echo "🧪 运行测试..."
	go test -v -race -cover ./...
	@echo "✅ 测试通过"

# 代码检查
lint:
	@echo "🔍 代码检查..."
	go vet ./...
	@echo "✅ 检查通过"

# 部署（蓝绿）
deploy:
	@echo "🚀 蓝绿部署..."
	bash deploy.sh ${VERSION}
	@echo "✅ 部署完成"

# 清理
clean:
	rm -rf bin/
	@echo "✅ 清理完成"
