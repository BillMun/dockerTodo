# main.tf

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">4.45.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_ecr_repository" "track_that_baby_repo" {
  name = "track_that_baby_repo"
}

resource "aws_ecs_cluster" "track_that_baby_cluster" {
  name = "track_that_baby_cluster"
}

resource "aws_iam_role" "ecsTaskExecutionRole" {
  name               = "ecsTaskExecutionRole"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
}

data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "ecsTaskExecutionRole_policy" {
  role       = aws_iam_role.ecsTaskExecutionRole.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_default_vpc" "default_vpc" {
}

resource "aws_default_subnet" "default_subnet_a" {
  availability_zone = "us-east-1a"
}

resource "aws_default_subnet" "default_subnet_b" {
  availability_zone = "us-east-1b"
}

resource "aws_alb" "application_load_balancer" {
  name               = "load-balancer-dev" #load balancer name
  load_balancer_type = "application"
  subnets = [ # Referencing the default subnets
    "${aws_default_subnet.default_subnet_a.id}",
    "${aws_default_subnet.default_subnet_b.id}"
  ]
  # security group
  security_groups = ["${aws_security_group.load_balancer_security_group.id}"]
}

resource "aws_security_group" "load_balancer_security_group" {
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Allow traffic in from all sources
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb_target_group" "target_group" {
  name        = "target-group"
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_default_vpc.default_vpc.id # default VPC
}

resource "aws_lb_listener" "listener" {
  load_balancer_arn = aws_alb.application_load_balancer.arn #  load balancer
  port              = "80"
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.target_group.arn # target group
  }
}

resource "aws_ecs_task_definition" "track_that_baby_frontend" {
  family                   = "track_that_baby_frontend"
  container_definitions    = <<DEFINITION
  [
    {
      "name": "track_that_baby_frontend",
      "image": "470290479859.dkr.ecr.us-east-1.amazonaws.com/track_that_baby_repo:frontend_latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 3000,
          "hostPort": 3000
        }
      ],
      "memory": 512,
      "cpu": 256
    }
  ]
  DEFINITION
  requires_compatibilities = ["FARGATE"] # use Fargate as the launch type
  network_mode             = "awsvpc"    # add the AWS VPN network mode as this is required for Fargate
  memory                   = 512         # Specify the memory the container requires
  cpu                      = 256         # Specify the CPU the container requires
  execution_role_arn       = aws_iam_role.ecsTaskExecutionRole.arn
}

resource "aws_ecs_task_definition" "track_that_baby_backend" {
  family                   = "track_that_baby_backend"
  container_definitions    = <<DEFINITION
  [
    {
      "name": "track_that_baby_backend",
      "image": "470290479859.dkr.ecr.us-east-1.amazonaws.com/track_that_baby_repo:backend_latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 3001,
          "hostPort": 3001
        }
      ],
      "memory": 512,
      "cpu": 256
    }
  ]
  DEFINITION
  requires_compatibilities = ["FARGATE"] # use Fargate as the launch type
  network_mode             = "awsvpc"    # add the AWS VPN network mode as this is required for Fargate
  memory                   = 512         # Specify the memory the container requires
  cpu                      = 256         # Specify the CPU the container requires
  execution_role_arn       = aws_iam_role.ecsTaskExecutionRole.arn
}


resource "aws_ecs_task_definition" "track_that_baby_mongo" {
  family                   = "track_that_baby_mongo"
  container_definitions    = <<DEFINITION
  [
    {
      "name": "track_that_baby_mongo",
      "image": "470290479859.dkr.ecr.us-east-1.amazonaws.com/track_that_baby_repo:mongo",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 27017,
          "hostPort": 27017
        }
      ],
      "memory": 512,
      "cpu": 256
    }
  ]
  DEFINITION
  requires_compatibilities = ["FARGATE"] # use Fargate as the launch type
  network_mode             = "awsvpc"    # add the AWS VPN network mode as this is required for Fargate
  memory                   = 512         # Specify the memory the container requires
  cpu                      = 256         # Specify the CPU the container requires
  execution_role_arn       = aws_iam_role.ecsTaskExecutionRole.arn
}

resource "aws_ecs_service" "track_that_baby_frontend_service" {
  name            = "track_that_baby_frontend_service"                   #
  cluster         = aws_ecs_cluster.track_that_baby_cluster.id           # Reference the created Cluster
  task_definition = aws_ecs_task_definition.track_that_baby_frontend.arn # Reference the task that the service will spin up
  launch_type     = "FARGATE"
  desired_count   = 1

  load_balancer {
    target_group_arn = aws_lb_target_group.target_group.arn # Reference the target group
    container_name   = aws_ecs_task_definition.track_that_baby_frontend.family
    container_port   = 3000 # Specify the container port
  }

  network_configuration {
    subnets          = ["${aws_default_subnet.default_subnet_a.id}", "${aws_default_subnet.default_subnet_b.id}"]
    assign_public_ip = true                                                # Provide the containers with public IPs
    security_groups  = ["${aws_security_group.service_security_group.id}"] # Set up the security group
  }
}

resource "aws_ecs_service" "track_that_baby_backend_service" {
  name            = "track_that_baby_backend_service"                   #
  cluster         = aws_ecs_cluster.track_that_baby_cluster.id          # Reference the created Cluster
  task_definition = aws_ecs_task_definition.track_that_baby_backend.arn # Reference the task that the service will spin up
  launch_type     = "FARGATE"
  desired_count   = 1

  load_balancer {
    target_group_arn = aws_lb_target_group.target_group.arn # Reference the target group
    container_name   = aws_ecs_task_definition.track_that_baby_backend.family
    container_port   = 3001 # Specify the container port
  }

  network_configuration {
    subnets          = ["${aws_default_subnet.default_subnet_a.id}", "${aws_default_subnet.default_subnet_b.id}"]
    assign_public_ip = true                                                # Provide the containers with public IPs
    security_groups  = ["${aws_security_group.service_security_group.id}"] # Set up the security group
  }
}

resource "aws_ecs_service" "track_that_baby_mongo_service" {
  name            = "track_that_baby_mongo_service"                   #
  cluster         = aws_ecs_cluster.track_that_baby_cluster.id        # Reference the created Cluster
  task_definition = aws_ecs_task_definition.track_that_baby_mongo.arn # Reference the task that the service will spin up
  launch_type     = "FARGATE"
  desired_count   = 1

  load_balancer {
    target_group_arn = aws_lb_target_group.target_group.arn # Reference the target group
    container_name   = aws_ecs_task_definition.track_that_baby_mongo.family
    container_port   = 27017 # Specify the container port
  }

  network_configuration {
    subnets          = ["${aws_default_subnet.default_subnet_a.id}", "${aws_default_subnet.default_subnet_b.id}"]
    assign_public_ip = false                                               # Provide the containers with public IPs
    security_groups  = ["${aws_security_group.service_security_group.id}"] # Set up the security group
  }
}

resource "aws_security_group" "service_security_group" {
  ingress {
    from_port = 27017
    to_port   = 27017
    protocol  = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    # Only allowing traffic in from the load balancer security group
    security_groups = ["${aws_security_group.load_balancer_security_group.id}"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}