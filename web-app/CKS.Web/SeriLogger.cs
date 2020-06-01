using Microsoft.Extensions.Configuration;
using NICE.Logging;
using NICE.Logging.Sinks.RabbitMQ;
using Serilog;
using System;
using Serilog.Events;

namespace CKS.Web
{
	/// <summary>
	/// This has been refactored for .NET Core 3.1
	///
	/// It now just sets up a LoggerConfiguration object based off appsettings.json (and secrets.json on dev machines)
	/// </summary>
	public static class SeriLogger
    {
        public static LoggerConfiguration GetLoggerConfiguration()
        {
            // Read Logging configuration
            var configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", optional: false)
                .Build();
            var logCfg = configuration.GetSection("Logging");

            var application = logCfg["Application"];
            var environment = logCfg["Environment"];
            var rabbitMQHost = logCfg["RabbitMQHost"];
            var rabbitMQVHost = logCfg["RabbitMQVHost"];
            var rabbitPortIsSet = int.TryParse(logCfg["RabbitMQPort"], out var rabbitMQPort);
            var rabbitMQUsername = logCfg["RabbitMQUsername"];
            var rabbitMQPassword = logCfg["RabbitMQPassword"];
            var rabbitMQExchangeName = logCfg["RabbitMQExchangeName"];
            var rabbitMQExchangeType = logCfg["RabbitMQExchangeType"];
            var serilogFilePath = logCfg["SerilogFilePath"] ?? logCfg["LogFilePath"];
            Enum.TryParse(logCfg["SerilogMinLevel"], out LogEventLevel serilogMinLevel);
            bool.TryParse(logCfg["UseRabbit"], out var useRabbit);
            bool.TryParse(logCfg["UseFile"], out var useFile);

            var serilogFormatter = new NiceSerilogFormatter(environment, application);
            var serilogConfiguration = new LoggerConfiguration()
                .Enrich.FromLogContext()
                .WriteTo.Console()
                .MinimumLevel.Is(serilogMinLevel);

            if (useRabbit && !string.IsNullOrEmpty(rabbitMQHost) && rabbitPortIsSet)
            {
                var rabbitCfg = new RabbitMQConfiguration
                {
                    Hostname = rabbitMQHost,
                    VHost = rabbitMQVHost,
                    Port = rabbitMQPort,
                    Username = rabbitMQUsername ?? "",
                    Password = rabbitMQPassword ?? "",
                    Protocol = RabbitMQ.Client.Protocols.AMQP_0_9_1,
                    Exchange = rabbitMQExchangeName,
                    ExchangeType = rabbitMQExchangeType
                };

                // Write logs to RabbitMQ / Kibana
                serilogConfiguration.WriteTo.RabbitMQ(rabbitCfg, serilogFormatter);
            }

            // Write logs to file
            if (useFile)
            {
                serilogConfiguration.WriteTo.RollingFile(serilogFormatter,
                    serilogFilePath,
                    fileSizeLimitBytes: 5000000,
                    retainedFileCountLimit: 5,
                    flushToDiskInterval: TimeSpan.FromSeconds(20));
            }

            return serilogConfiguration;
        }
    }
}
